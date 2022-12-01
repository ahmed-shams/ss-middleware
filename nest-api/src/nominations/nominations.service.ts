import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CreateLeadResponseDto } from 'src/leads/dto/create-lead-response.dto';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { ReportsService } from 'src/reports/reports.service';
import { GoogleMapsService } from 'src/sales-force/google-maps/google-maps.service';
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
    private readonly googleAPIService: GoogleMapsService
  ) {
  }

  async upsertNominations(nominations: Array<Nomination>) {

    await this.entityManager.createQueryBuilder()
      .insert().into(Nomination).values(nominations)
      .orUpdate(['category'],[],{skipUpdateIfNoValuesChanged:true})
      .execute();


    const nominationsToUpdate = await this.findAllByEntityName(nominations);
    console.log(nominationsToUpdate[0]);
    await this.nominationRepository.save(nominationsToUpdate);

  }

  async fetch(fetchNominationDto: FetchNominationDto) {
    const { organizationId, organizationPromotionId, promotionId }
      = fetchNominationDto;
    console.log("Getting Report from Second street");
    const nominationsFromSS: any = await this.reportsService.getWinnersReport(organizationId, promotionId, organizationPromotionId);
    console.log("Downloaded Report from Second street");
    const nominations: Array<Nomination> = await this.prepareNominations(nominationsFromSS);

    try{
    await this.upsertNominations(nominations);
    }
    catch{
      "Failed to insert nominations into the database";
    }
    return { success: true };

  }

  private async prepareNominations(nominationsFromSS: any) {
    const nominations: Array<Nomination> = nominationsFromSS.map(x => {

      return {
        entity_name: x['Voted For Entry Name'],
        category: x['Category'],
        vote_count: 1,
        id: null
      };

    });

    for (let index = 0; index < 10; index++) {
      let lead:CreateLeadDto = {
        Company: nominationsFromSS[index]['Voted For Entry Name'],
        LastName: nominationsFromSS[index]['Last Name']
      }
      const searchResult = await this.googleAPIService.textSearch(lead.Company);
      if(searchResult && searchResult.placeId)
      {
        const details = await this.googleAPIService.placeDetails(searchResult.placeId);
        lead.phoneNumber = details.phoneNumber ;
        lead.website = details.website
        lead.address = details.address;
      }
     
    console.log( await this.createLeads(lead));
    }
    return nominations;
  }

  createLeads(createLeadDto: CreateLeadDto){
    const config = {
      headers: { Authorization: `Bearer ${process.env.TOKEN}` }
    };

    const body: any =   {
      "Company": createLeadDto.Company,
      "LastName": 'Excolo',
      "Phone": createLeadDto.phoneNumber,
      "OwnerId": "005G0000003tIZMIA2",
      "Market__c": "Connecticut",
      "Business_Unit__c": "328",
      "LeadSource": "SS Best Of CT 22",
      "SS_Merchant_Category__c": "",
      "Website": createLeadDto.website,

      }

    if(createLeadDto.address){
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
    return this.httpService.axiosRef.post<CreateLeadResponseDto>(`https://hearstnp--test.sandbox.my.salesforce.com/services/data/v55.0/sobjects/Lead`,
  body
    , config).then((r) => {
      return r.data;
    })
  }


  findAll() {
    return this.nominationRepository.find();
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
       no.category IN (:category) and vote_count <= 5`
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

  update(id: number, updateNominationDto: UpdateNominationDto) {
    const nomination: Nomination = {
      id,
      category: updateNominationDto.category,
      entity_name: updateNominationDto.entityName,
      vote_count: updateNominationDto.voteCount
    }
    return this.nominationRepository.update(id, nomination);
  }

  remove(id: number) {
    return this.nominationRepository.delete({ id });
  }
}
function createLeadDto<T>(arg0: string, createLeadDto: any, config: any) {
  throw new Error('Function not implemented.');
}

