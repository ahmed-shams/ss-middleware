import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';
import { NominationRequest } from './entities/nomination-request.entity';

@Injectable()
export class NominationRequestService {

  constructor(@InjectRepository(NominationRequest) private readonly nominationRequestRepo: Repository<NominationRequest>) {

  }
  async create(createNominationRequestDto: CreateNominationRequestDto): Promise<NominationRequest> {
    let nominationRequest: NominationRequest = {
      promotionId: createNominationRequestDto.promotionId,
      organizationPromotionId: createNominationRequestDto.organizationPromotionId,
      organizationId: createNominationRequestDto.organizationId,
      state: createNominationRequestDto.state,
      city: createNominationRequestDto.city,
      contestTitle: createNominationRequestDto.contestTitle,
      id:undefined
    }
    return this.nominationRequestRepo.save(nominationRequest);
  }

  findAll() {
    return this.nominationRequestRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} nominationRequest`;
  }

  update(id: number, updateNominationRequestDto: UpdateNominationRequestDto) {
    return `This action updates a #${id} nominationRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} nominationRequest`;
  }
}
