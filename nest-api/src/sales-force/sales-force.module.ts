import { Module } from '@nestjs/common';
import { SalesForceService } from './sales-force.service';
import { SalesForceController } from './sales-force.controller';

@Module({
  controllers: [SalesForceController],
  providers: [SalesForceService]
})
export class SalesForceModule {}
