import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Merchant } from 'src/merchants/entities/merchant.entity';
import { Repository } from 'typeorm';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { UpdateNominationDto } from './dto/update-nomination.dto';
import { Nomination } from './entities/nomination.entity';

@Injectable()
export class NominationsService {

  constructor(@InjectRepository(Nomination) private readonly nominationRepository: Repository<Nomination>){
  }

  async create(createNominationDto: CreateNominationDto) {
    
    const nomination: Nomination = {
      buzzboard_info: createNominationDto.buzzboardInfo,
      catagory_id: createNominationDto.catagoryId,
      location_id: createNominationDto.locationId,
      preloaded: createNominationDto.preloaded,
      merchant_id: createNominationDto.merchantId,
      vote_id: createNominationDto.voteId,
      contest_id: createNominationDto.contestId,
      id: undefined,
      merchant: new Merchant(),
      category: new Category() 
    }
    nomination.merchant.id = createNominationDto.merchantId;
    nomination.category.id = createNominationDto.catagoryId;
    

    console.log(nomination);
    return this.nominationRepository.save(nomination);
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
      buzzboard_info: updateNominationDto.buzzboardInfo,
      catagory_id: updateNominationDto.catagoryId,
      location_id: updateNominationDto.locationId,
      preloaded: updateNominationDto.preloaded,
      merchant_id: updateNominationDto.merchantId,
      vote_id: updateNominationDto.voteId,
      contest_id: updateNominationDto.contestId,
      id,
      category: new Category(),
      merchant: new Merchant(),
    }
    return this.nominationRepository.update(id, nomination);
  }

  remove(id: number) {
    return this.nominationRepository.delete({id});
  }
}
