import { Injectable } from '@nestjs/common';
import { Client, InjectJsForce } from '@ntegral/nestjs-force';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  public constructor(@InjectJsForce() private readonly client: Client) {}


  


  create() {
    let contacts = [];
    console.log(this.client.conn);
    this.client.conn
    this.client.conn.sobject("Lead").select().exec(undefined,(err, result) => {
        if (err) { return console.error(err); }
        console.log('results', result);
        contacts = result;
    });
    return contacts;
  }

  findAll() {
    return `This action returns all leads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
