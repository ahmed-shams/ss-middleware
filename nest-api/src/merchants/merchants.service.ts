import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { Merchant } from './entities/merchant.entity';

@Injectable()
export class MerchantsService {

  constructor(@InjectRepository(Merchant) private readonly merchantRepository: Repository<Merchant>){

  }

  create(createMerchantDto: CreateMerchantDto) {
    const merchant: Merchant = {...createMerchantDto, id:undefined}
    return this.merchantRepository.save(merchant);
  }

  findAll() {
    return this.merchantRepository.find();
  }

  findOne(id: string) {
    return this.merchantRepository.findOne({
      where: {
        id
      }
    });
  }

  update(id: string, updateMerchantDto: UpdateMerchantDto) {
    const category: Merchant = {
      id: updateMerchantDto.id,
      name: updateMerchantDto.name,
      salesForceId: updateMerchantDto.salesForceId
    }
    return this.merchantRepository.update(id, category);
  }

  remove(id: string) {
    return this.merchantRepository.delete({id});
  }
}
