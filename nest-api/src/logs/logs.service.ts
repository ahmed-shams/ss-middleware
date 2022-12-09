import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { mergeScan } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './entities/log.entity';

@Injectable()
export class LogsService {

  constructor(@InjectRepository(Log) private readonly logRepository: Repository<Log>) {
  }

  log(id: string, message: string) {

    console.log(message)

    return this.logRepository.save({
      id,
      message
    })
  }

  findAll() {
    return `This action returns all logs`;
  }

  findOne(id: string): Promise<Array<Log>> {
    return this.logRepository.find({
      where: {
        id: id
      }
    })
  }

  update(id: number, updateLogDto: UpdateLogDto) {
    return `This action updates a #${id} log`;
  }

  remove(id: number) {
    return `This action removes a #${id} log`;
  }
}
