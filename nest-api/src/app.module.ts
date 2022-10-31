import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InitializationService } from './init';
import { CategoriesModule } from './categories/categories.module';
import { MerchantsModule } from './merchants/merchants.module';
import { NominationsModule } from './nominations/nominations.module';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      username: process.env.USERNAME,
      database: process.env.DB,
      password: process.env.PASSWORD,
      entities: [`dist/**/*.entity.js`],
      autoLoadEntities:true,
      synchronize: true,
    }),
    CategoriesModule,
    MerchantsModule,
    NominationsModule,
    LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitializationService],
})
export class AppModule {}
