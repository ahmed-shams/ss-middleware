import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BuzzboardService } from './buzzboard.service';
import { CreateBuzzboardDto } from './dto/create-buzzboard.dto';

@ApiTags('buzzboard')
@Controller('buzzboard')
export class BuzzboardController {
  constructor(private readonly buzzboardService: BuzzboardService) {}

  
  @Post('create')
  create(@Body() createBuzzboardDto: CreateBuzzboardDto) {
    return this.buzzboardService.create(createBuzzboardDto);
  }

  @Post('callback')
  callback(@Request() req,) {
    console.log('data:' , req.body.data);
  }

}
