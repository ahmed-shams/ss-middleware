import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBtcAddress } from 'class-validator';
import { NODE_STREAM_INPUT, parse } from 'papaparse';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/categories/entities/category.entity';
import { CreateLeadResponseDto } from 'src/leads/dto/create-lead-response.dto';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
import { LogsService } from 'src/logs/logs.service';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { NominationRequest } from 'src/nomination-request/entities/nomination-request.entity';
import { NominationRequestService } from 'src/nomination-request/nomination-request.service';
import { ReportsService } from 'src/reports/reports.service';
import { GoogleMapsService } from 'src/sales-force/google-maps/google-maps.service';
import { Vote } from 'src/votes/entities/vote.entity';
import { VotesService } from 'src/votes/votes.service';
// import { ReportsService } from 'src/reports/reports.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { FetchNominationDto } from './dto/fetch-nominations.dto';
import { UpdateNominationDto } from './dto/update-nomination.dto';
import { Nomination } from './entities/nomination.entity';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as jsforce from 'jsforce'



@Injectable()
export class NominationsService {

  constructor(@InjectRepository(Nomination) private readonly nominationRepository: Repository<Nomination>,
    private readonly reportsService: ReportsService,
    private readonly entityManager: EntityManager,
    private readonly httpService: HttpService,
    private readonly googleAPIService: GoogleMapsService,
    private readonly nominationRequestService: NominationRequestService,
    private readonly voteService: VotesService,
    private readonly logService: LogsService
  ) {
  }

  async upsertNominations(nominations: Array<Nomination>) {

    await this.entityManager.createQueryBuilder()
      .insert().into(Nomination).values(nominations)
      .orUpdate(['category'], [], { skipUpdateIfNoValuesChanged: true })
      .execute();
    return;


    // const nominationsToUpdate = await this.findAllByEntityName(nominations);
    // console.log(nominationsToUpdate[0]);
    // await this.nominationRepository.save(nominationsToUpdate);

  }

  async fetch(fetchNominationDto: FetchNominationDto) {
 
    const id = uuidv4()
    await this.logService.log(id, "Logs Creation Started!")
    this.addOperations(fetchNominationDto, id);
  
    return { success: true, id };

  }

  private async addOperations(fetchNominationDto: FetchNominationDto, id:string){
    const { organizationId, organizationPromotionId, promotionId, city, state, contestTitle }
    = fetchNominationDto;
    // await this.remove();
    await this.voteService.remove();
    await this.nominationRequestService.create({
      city,
      contestTitle,
      organizationId,
      organizationPromotionId,
      promotionId,
      state
    });

    this.logService.log(id, "Getting Report from Second Street, (will take approx. 2 minutes)");
    const reportJson: any = await this.reportsService.getWinnersReport(organizationId, promotionId, organizationPromotionId);
    this.logService.log(id, `second result ${reportJson}`);
    await this.parseWinnerReport(reportJson.reports[0].file_url, id);
    
    // uncomment this to actually create the lead on SF, we need to make sure this only happens after ALL records have been processed from the csv
   // await this.PrepareAndCreateLeads(id);
  }

  private async PrepareAndCreateLeads(id) {
    var oauth2 = new jsforce.OAuth2({
      // you can change loginUrl to connect to sandbox or prerelease env.
      loginUrl : process.env.SF_LOGIN_URL,
      clientId : process.env.SF_CLIENT_ID,
      clientSecret : process.env.SF_CLIENT_SECRET,
      redirectUri : 'http://localhost:8080/',
    });
    let q = await oauth2.authenticate(process.env.SF_USERNAME, process.env.SF_PASSWORD,(token)=>{      
    });

    

    const nominationsForLeads: Array<Nomination> = await this.getNominations(1, 1000, true);

  /* uncomment the line below, if you want create leads for all records 
     satisifying the vote count condition for now only first 10 are created */

    const countForLeadsToBeCreated = nominationsForLeads.length; 
console.log("countForLeadsToBeCreated: ", countForLeadsToBeCreated);    
    // const countForLeadsToBeCreated =10;

    if(!countForLeadsToBeCreated) {
      await this.logService.log(id, "No Nominations to Create Salesforce Leads for")
    }
 for (let index = 0; index < countForLeadsToBeCreated; index++) {

  let nomination = nominationsForLeads[index]
  let lead: CreateLeadDto = {
    Company: nomination.entity_name,
    nominationId: nomination.id,
    LastName: '',
    address: nomination.address,
    website: nomination.website,
    phoneNumber: nomination.phoneNumber,
    category: nomination.category
  };
  console.log(lead)
  await this.createLeads(lead, id, q.access_token); 
 }
  }

  private async getNominations(count: number, take: number, restrictCount = false, excludeWithLeadIds = true) {

    const phone = "`phone-number`";
    const countClause = restrictCount ? `having count(*) >= 5`: ``;
    const whereLeadisNull = excludeWithLeadIds ? `where nomination.lead_id is NULL`: ``;
    const nominationsForLeads: Array<Nomination> =
      await this.entityManager.query(

        `SELECT
      nomination.id as id,
      nomination.entity_name as entity_name,
      nomination.category as category,
      nomination.address as address,
      nomination.lead_id as leadsId,
      ${phone} as phoneNumber,
      website, 
      count(*) as vote_count
      from vote 
      inner join nomination 
      On nomination.entity_name = vote.entity_name 
      ${whereLeadisNull}
      group by nomination.id, nomination.entity_name, nomination.category, address, ${phone}
      ${countClause}
      order by ${phone} DESC
      ;`
      )
    return nominationsForLeads;
  }

  private async prepareNominations(nominationsFromSS: any, logId: string) {
    const votes: Array<Vote> = [];
    let nameNotFound = 0;
    console.log("Before processing length: ", nominationsFromSS.length);
    for (let index = 0; index < nominationsFromSS.length; index++) {
      const nomination = nominationsFromSS[index];
// console.log("NOMINATION DATA: ",nominationsFromSS.length, nominationsFromSS[index], index);
      if( nomination['Voted For Entry Name'] === undefined) {
        nominationsFromSS.splice(index, 1);
        nameNotFound++;
        continue;
      }
      const existingNomination = await this.findNomination(nomination['Voted For Entry Name'], nomination['Category']);
      // console.log("exiting: ", existingNomination);
      if(existingNomination.length > 0) {
        nominationsFromSS.splice(index, 1);
        // this.logService.log(logId, "Nomination exists for: " + nomination['Voted For Entry Name']);
        continue;
      }
      this.logService.log(logId, "Now Processing Record: " + nomination);
      const searchResult = await this.googleAPIService.textSearch(nomination['Voted For Entry Name']);
      console.log("Place searchResult", searchResult);   
      if (searchResult && searchResult.placeId) {
        const details = await this.googleAPIService.placeDetails(searchResult.placeId);
        nomination.phoneNumber = details.phoneNumber;
        nomination.website = details.website;
        nomination.address = details.address;
console.log("Place details", details);        
      }
// moved this here to keep track of votes even if nomination exists
      votes.push({
        entity_name: nomination['Voted For Entry Name'],
        category: nomination['Category'],
        entry_id: nomination['Voted for Entry Id'],
        vote_date:nomination[`"Vote Date (Eastern Time)"`]|| nomination[`Vote Date (Eastern Time)`] || nomination[`"Vote Date (Central Time)"`],
        email: nomination['Voter Email Address'],
        ip_address: nomination['Vote Ip Address'],
        id:undefined
      })

    }
    console.log("After processing length: ", nominationsFromSS.length);
    // not sure why we are looping through the list a second time??
    // can we not do this in the above loop?
    const nominations: Array<Nomination> = nominationsFromSS.map(x => {      
      return {
        entity_name: x['Voted For Entry Name'],
        category: x['Category'],
        vote_count: 1,
        id: null,
        address: x.address || '',
        website: x.website || '',
        phoneNumber: x.phoneNumber || ''
      }

    });
    return { nominations, votes};
  }

  async parseWinnerReport(url, id) {
    this.logService.log(id, url);
    let nominationsTemp = [];
    return new Promise<void>(async (resolve, reject) => {
      const parseStream = parse(NODE_STREAM_INPUT, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        transformHeader: h => h.trim()
      });

      const { data: res } = await firstValueFrom(
        this.httpService.get(url, { responseType: 'stream' }),
      );

      const dataStream = res.pipe(parseStream);

      // const data = [];

      parseStream.on('data', async (chunk) => {       
        nominationsTemp.push(chunk)
        if (nominationsTemp.length > 1000) {
          try {
          parseStream.pause();
          this.logService.log(id,"Pushing chunck of 1000 records")
          
            const { nominations, votes} = await this.prepareNominations(nominationsTemp, id);
            if(votes.length) {
              await this.voteService.create(votes)
            }
            
            if(nominations .length){
              await this.upsertNominations(nominations);
            }
            
            nominationsTemp = [];
            parseStream.resume();
            this.logService.log(id,"Pushing next chunck of 1000 records")
          
          }
          catch (ex) {
            this.logService.log(id,"Failed to insert nominations into the database" + ex);
            throw ex;
          }
          finally{
            this.logService.log(id,"Pushing chunck of less than 1000 records")
            parseStream.end();
            return resolve();
          }
        }

      });

      dataStream.on('finish', async () => {
        if(nominationsTemp.length){
          const { nominations, votes} = await this.prepareNominations(nominationsTemp, id);
          await this.voteService.create(votes)
          await this.upsertNominations(nominations);
          nominationsTemp = [];
        }
        this.logService.log(id,'Finished with creating nominations');
        return resolve();
      });

    });

  }


  async createLeads(createLeadDto: CreateLeadDto, id:string, token:string) {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    this.logService.log( id, 'Creating Lead with DTO:');
    
    const body: any = {
      "Company": createLeadDto.Company,
      "LastName": 'Excolo',
      "Phone": createLeadDto.phoneNumber,
      "OwnerId": "005G0000003tIZMIA2",
      "Market__c": "Connecticut",
      "Business_Unit__c": "328",
      "LeadSource": "SS Best Of CT 22",
      "Website": createLeadDto.website,
      "SS_Merchant_Category__c": createLeadDto.category

    }

    if (createLeadDto.address) {
      const address = createLeadDto.address.split(',');
      //27 Main St, Chatham, NY 12037, USA
      body.Street = address[0];
      body.City = address[1];
      const stateWithZip = address[2].split(' ');
      if (stateWithZip && stateWithZip.length >= 2) {
        body.State = stateWithZip[0];
        body.PostalCode = stateWithZip[1];
      }
    }

    try {
      await this.httpService.axiosRef.post<CreateLeadResponseDto>(process.env.SF_CREATE_LEAD_URL,
        body
        , config).then(async (r) => {

          await this.nominationRepository.save({id:createLeadDto.nominationId,leadsId: r.data.id })

          await this.logService.log(id, `Lead added with id ${createLeadDto.nominationId}`)
          return r.data;
        })
    }
    catch (ex) {
      this.logService.log( id, "excetpion: " + ex);
    }
    return 
  }


  findAll() {
    return this.getNominations(0,1000, false, false);
  }

  findNomination(name: string, category: string) {  
    // console.log("Nomination to check", name, category);  
    return this.entityManager.createQueryBuilder(Nomination, 'no')
      .where(`no.entity_name = "${name}" &&
       no.category = "${category}"`
      ).select(['no.id', 'no.lead_id', 'no.address'])
      .execute();
  }

  findOne(id: number) {
    return this.nominationRepository.findOne({
      where: {
        id
      }
    });
  }


  remove() {
    return this.nominationRepository.clear()
  }
}


