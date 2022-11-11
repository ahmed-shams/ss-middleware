import { Injectable } from '@nestjs/common';


@Injectable()
export class SalesForceService {
  create() {
    return 'This action adds a new salesForce';
  }

  findAll() {


    return `This action returns all salesForce`;
  }

  findOne(id: number) {
    return `This action returns a #${id} salesForce`;
  }

  update(id: number) {
    return `This action updates a #${id} salesForce`;
  }

  remove(id: number) {
    return `This action removes a #${id} salesForce`;
  }
}
