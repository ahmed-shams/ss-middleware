import { Module } from '@nestjs/common';
import { BuzzboardService } from './buzzboard.service';
import { BuzzboardController } from './buzzboard.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [BuzzboardController],
  providers: [BuzzboardService]
})
export class BuzzboardModule {}
