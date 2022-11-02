import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NominationsService } from './nominations.service';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { UpdateNominationDto } from './dto/update-nomination.dto';
import { FetchNominationDto } from './dto/fetch-nominations.dto';

@Controller('nominations')
export class NominationsController {
  constructor(private readonly nominationsService: NominationsService) {}

  @Post('fetch')
  create(@Body() createNominationDto: FetchNominationDto) {
    return this.nominationsService.fetch(createNominationDto);
  }

  @Get()
  findAll() {
    return this.nominationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.nominationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateNominationDto: UpdateNominationDto) {
    return this.nominationsService.update(id, updateNominationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nominationsService.remove(+id);
  }
}
