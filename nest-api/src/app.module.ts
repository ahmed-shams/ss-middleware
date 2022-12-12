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
import { LogsModule } from './logs/logs.module';
import { JsForceModule } from '@ntegral/nestjs-force';

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
    JsForceModule.forRoot({
      username: 'secondstreet@hearst.com.test',
      password: 'R2834m4',
      security_token: 'BC9FE1671D8A6D93C543BE3B577B0040C3AE24C6F21AA04BF79D84C8B3E5AECB',
  
      options: {
      loginUrl: 'https://hearstnp--test.sandbox.my.salesforce.com/',
      },
      }),
    CategoriesModule,
    MerchantsModule,
    NominationsModule,
    LeadsModule,
    ReportsModule,
    BuzzboardModule,
    SalesForceModule,
    NominationRequestModule,
    VotesModule,
    LogsModule
  ],
  controllers: [AppController],
  providers: [AppService, InitializationService],
})
export class AppModule {}
