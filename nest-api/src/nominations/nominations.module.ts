import { Module } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { NominationsController } from './nominations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomination } from './entities/nomination.entity';
import { ReportsModule } from 'src/reports/reports.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ReportsService } from 'src/reports/reports.service';
import { SalesForceModule } from 'src/sales-force/sales-force.module';
import { NominationRequestModule } from 'src/nomination-request/nomination-request.module';
import { VotesModule } from 'src/votes/votes.module';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Nomination]),
    ReportsModule,
    HttpModule,
    SalesForceModule,
    NominationRequestModule,
    VotesModule,
    LogsModule
  ],
  controllers: [NominationsController],
  providers: [NominationsService]
})
export class NominationsModule { }
