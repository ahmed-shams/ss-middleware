import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { ReportsService } from 'src/reports/reports.service';
// import { ReportsService } from 'src/reports/reports.service';
import { Repository } from 'typeorm';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { FetchNominationDto } from './dto/fetch-nominations.dto';
import { UpdateNominationDto } from './dto/update-nomination.dto';
import { Nomination } from './entities/nomination.entity';

@Injectable()
export class NominationsService {

  constructor(@InjectRepository(Nomination) private readonly nominationRepository: Repository<Nomination>,

  private readonly reportsService: ReportsService
  ){
  }

  async fetch(fetchNominationDto: FetchNominationDto) {

    const { organizationId, organizationPromotionId, promotionId }
      =
      fetchNominationDto;

    const nominationsFromSF = await this.reportsService.getWinnersReport(organizationId, promotionId, organizationPromotionId);
    return nominationsFromSF;

  }

  findAll() {
    return this.nominationRepository.find();
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
    return this.nominationRepository.delete({id});
  }
}
