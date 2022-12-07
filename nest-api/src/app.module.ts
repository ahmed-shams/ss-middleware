import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitializationService } from './init';
import { CategoriesModule } from './categories/categories.module';
import { MerchantsModule } from './merchants/merchants.module';
import { NominationsModule } from './nominations/nominations.module';
import { LeadsModule } from './leads/leads.module';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { ReportsService } from './reports/reports.service';
import { BuzzboardModule } from './buzzboard/buzzboard.module';
import { SalesForceModule } from './sales-force/sales-force.module';
import { NominationRequestModule } from './nomination-request/nomination-request.module';
import { VotesModule } from './votes/votes.module';
import { NominationsService } from './nominations/nominations.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      database: process.env.DB,
      password: process.env.DB_PASSWORD,
      entities: [`dist/**/*.entity.js`],
      autoLoadEntities: true,
      synchronize: true,
      debug:false
    }),
    CategoriesModule,
    MerchantsModule,
    NominationsModule,
    LeadsModule,
    ReportsModule,
    BuzzboardModule,
    SalesForceModule,
    NominationRequestModule,
    VotesModule
  ],
  controllers: [AppController],
  providers: [AppService, InitializationService],
})
export class AppModule {}
