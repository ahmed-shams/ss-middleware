import { Injectable } from '@nestjs/common';
import { CreateBuzzboardDto } from './dto/create-buzzboard.dto';
import { UpdateBuzzboardDto } from './dto/update-buzzboard.dto';
import fetch from 'node-fetch';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class BuzzboardService {

  constructor(
    private readonly httpService: HttpService) {

  }

  async create(createBuzzboardDto: CreateBuzzboardDto) {

    const response = await this.httpService.axiosRef.post('https://apis.buzzboard.com/v5.0/records/enrich',
      {
        business_name: createBuzzboardDto.BusinessName,
        city: createBuzzboardDto.City,
        callback_url: process.env.BUZZBOARD_CALLBACK_URL
      }, {
      headers: {
        'cache-control': 'no-cache',
        'authorization': `Bearer ${process.env.BUZZBOARD_TOKEN}`,
        'X-Authorization': `Bearer ${process.env.BUZZBOARD_TOKEN}`,
        'content-type': 'application/json'
      }
    }
    )
    return response.status;
  }

  findAll() {
    return `This action returns all buzzboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buzzboard`;
  }

  update(id: number, updateBuzzboardDto: UpdateBuzzboardDto) {
    return `This action updates a #${id} buzzboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} buzzboard`;
  }
}
