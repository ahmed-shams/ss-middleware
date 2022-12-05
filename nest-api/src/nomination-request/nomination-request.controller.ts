import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NominationRequestService } from './nomination-request.service';
import { CreateNominationRequestDto } from './dto/create-nomination-request.dto';
import { UpdateNominationRequestDto } from './dto/update-nomination-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Nomination Request')
@Controller('nomination-request')
export class NominationRequestController {
  constructor(private readonly nominationRequestService: NominationRequestService) {}

  // @Post()
  // create(@Body() createNominationRequestDto: CreateNominationRequestDto) {
  //   return this.nominationRequestService.create(createNominationRequestDto);
  // }

  @Get()
  findAll() {
    return this.nominationRequestService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.nominationRequestService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNominationRequestDto: UpdateNominationRequestDto) {
  //   return this.nominationRequestService.update(+id, updateNominationRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.nominationRequestService.remove(+id);
  // }
}
