import { Module } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomination } from './entities/nomination.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nomination])],
  controllers: [NominationsController],
  providers: [NominationsService]
})
export class NominationsModule {}
