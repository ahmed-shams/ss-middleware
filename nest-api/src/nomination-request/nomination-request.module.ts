import { Module } from '@nestjs/common';
import { NominationRequestService } from './nomination-request.service';
import { NominationRequestController } from './nomination-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NominationRequest } from './entities/nomination-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NominationRequest])],
  controllers: [NominationRequestController],
  providers: [NominationRequestService],
  exports: [NominationRequestService]
})
export class NominationRequestModule {}
