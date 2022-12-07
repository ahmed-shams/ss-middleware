import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isBtcAddress } from 'class-validator';
import { NODE_STREAM_INPUT, parse } from 'papaparse';
import { firstValueFrom } from 'rxjs';
import { Category } from 'src/categories/entities/category.entity';
import { CreateLeadResponseDto } from 'src/leads/dto/create-lead-response.dto';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
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

@Injectable()
export class NominationsService {

  constructor(@InjectRepository(Nomination) private readonly nominationRepository: Repository<Nomination>,
    private readonly reportsService: ReportsService,
    private readonly entityManager: EntityManager,
    private readonly httpService: HttpService,
    private readonly googleAPIService: GoogleMapsService,
    private readonly nominationRequestService: NominationRequestService,
    private readonly voteService: VotesService
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
    const { organizationId, organizationPromotionId, promotionId, city, state, contestTitle }
      = fetchNominationDto;

    await this.remove();
    await this.voteService.remove();
    await this.nominationRequestService.create({
      city,
      contestTitle,
      organizationId,
      organizationPromotionId,
      promotionId,
      state
    })

    console.log("Getting Report from Second street");
    const reportJson: any = await this.reportsService.getWinnersReport(organizationId, promotionId, organizationPromotionId);
    await this.parseWinnerReport(reportJson.reports[0].file_url);
    
    
    await this.PrepareAndCreateLeads();
  
    return { success: true };

  }

  private async PrepareAndCreateLeads() {
    const nominationsForLeads: Array<Nomination> = await this.getNominations(1,10);

      console.log(nominationsForLeads.length)
    nominationsForLeads.forEach(async (nomination) => {
      let lead: CreateLeadDto = {
        Company: nomination.entity_name,
        LastName: '',
        address: nomination.address,
        website: nomination.website,
        phoneNumber: nomination.phoneNumber
      };
      await this.createLeads(lead);
    });
  }

  private async getNominations(count:number, take: number) {

    const phone = "`phone-number`";
    const nominationsForLeads: Array<Nomination> = 
   await this.entityManager.query(

      `SELECT
      nomination.id as id,
      nomination.entity_name as entity_name,
       nomination.category as category,
        nomination.address as address,
      ${phone} as phoneNumber,
      website, 
      count(*) as vote_count
      from vote 
      inner join nomination 
      On nomination.entity_name = vote.entity_name 
      group by nomination.id, nomination.entity_name, nomination.category, address, ${phone}
      order by ${phone} DESC
      ;`
    )
    return nominationsForLeads;
  }

  private async prepareNominations(nominationsFromSS: any) {


    for (let index = 0; index < 10; index++) {
      const nomination = nominationsFromSS[index]
    
      const searchResult = await this.googleAPIService.textSearch(nomination['Voted For Entry Name']);
      if (searchResult && searchResult.placeId) {
        const details = await this.googleAPIService.placeDetails(searchResult.placeId);
        nomination.phoneNumber = details.phoneNumber;
        nomination.website = details.website;
        nomination.address = details.address;
      }

    }
    const votes: Array<Vote> = []
    const nominations: Array<Nomination> = nominationsFromSS.map(x => {

      votes.push({
        entity_name: x['Voted For Entry Name'],
        category: x['Category'],
        entry_id: x['Voted for Entry Id'],
        vote_date:x[`"Vote Date (Eastern Time)"`]|| x[`Vote Date (Eastern Time)`],
        email: x['Voter Email Address'],
        ip_address: x['Vote Ip Address'],
        id:undefined
      })

      

    
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

  async parseWinnerReport(url) {
    console.log(url);
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
        if (nominationsTemp.length > 10) {
          parseStream.pause();
          console.log("Pushing chunck of 15000 records")
          try {
            const { nominations, votes} = await this.prepareNominations(nominationsTemp);
            await this.voteService.create(votes)
            await this.upsertNominations(nominations);
            nominationsTemp = [];

          
          }
          catch (ex) {
            console.log("Failed to insert nominations into the database");
            throw ex;
          }
          finally{
            parseStream.end();
            return resolve();
          }
        }

      });

      dataStream.on('finish', () => {
        console.log('Finished with creating nominations');
        return resolve();
      });

    });

  }


  async createLeads(createLeadDto: CreateLeadDto) {
    const config = {
      headers: { Authorization: `Bearer ${process.env.TOKEN}` }
    };

    console.log('Creating Lead with DTO:', createLeadDto);
    
    const body: any = {
      "Company": createLeadDto.Company,
      "LastName": 'Excolo',
      "Phone": createLeadDto.phoneNumber,
      "OwnerId": "005G0000003tIZMIA2",
      "Market__c": "Connecticut",
      "Business_Unit__c": "328",
      "LeadSource": "SS Best Of CT 22",
      "Website": createLeadDto.website,

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
      await this.httpService.axiosRef.post<CreateLeadResponseDto>(`https://hearstnp.my.salesforce.com/services/data/v55.0/sobjects/Lead`,
        body
        , config).then((r) => {
          console.log(r.data);
          return r.data;
        })
    }
    catch (ex) {
      console.log("excetpion: ", ex);
    }
    return 
  }


  findAll() {
    return this.getNominations(0,15000);
  }

  findAllByEntityName(nomination: Array<Nomination>) {

    const entityArray: Array<string> = [];
    const categoryArray: Array<string> = [];
    nomination.forEach(nomination => {
      entityArray.push(nomination.entity_name)
      categoryArray.push(nomination.category);
    });
    return this.entityManager.createQueryBuilder(Nomination, 'no')
      .where(`no.entity_name IN (:entity_name) &&
       no.category IN (:category)`
      ).setParameters(
        {
          entity_name: entityArray
          , category: categoryArray
        }
      )
      .select(['no.id as id', 'no.entity_name as entity_name', 'no.category as category', 'no.vote_count+1 as vote_count'])
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


