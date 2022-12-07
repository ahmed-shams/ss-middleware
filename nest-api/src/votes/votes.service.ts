import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nomination } from 'src/nominations/entities/nomination.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VotesService {
  constructor(@InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    private readonly entityManager: EntityManager,) {
  }
  create(votes:Vote[] ) {
    return this.voteRepository.save(votes);
  }

  findAll() {
    return this.voteRepository.find({take: 100});
  }

  findOne(id: number) {
    return `This action returns a #${id} vote`;
  }

  update(id: number, updateVoteDto: UpdateVoteDto) {
    return `This action updates a #${id} vote`;
  }

  remove() {
    return this.voteRepository.clear();
  }
}
