import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { ReportsService } from 'src/reports/reports.service';
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
  ) {
  }

  async upsertNomincations(nominations: Array<Nomination>) {

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
    const nominationsFromSF: any = await this.reportsService.getWinnersReport(organizationId, promotionId, organizationPromotionId);
    const nominations: Array<Nomination> = nominationsFromSF.map(x => {

      return {
        entity_name: x['Voted For Entry Name'],
        category: x['Category'],
        vote_count: 1,
        id:null
      }

    });

    await this.upsertNomincations(nominations);
    return { success: true };

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
