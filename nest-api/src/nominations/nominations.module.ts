import { Module } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomination } from './entities/nomination.entity';
import { ReportsModule } from 'src/reports/reports.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReportsService } from 'src/reports/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nomination]), ReportsModule, HttpModule ],
  controllers: [NominationsController],
  providers: [NominationsService]
})
export class NominationsModule {}
