import { Module } from '@nestjs/common';
import { SalesForceService } from './sales-force.service';
import { SalesForceController } from './sales-force.controller';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [SalesForceController],
  providers: [SalesForceService, GoogleMapsService],
  exports: [GoogleMapsService]
})
export class SalesForceModule {}
