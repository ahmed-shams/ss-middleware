import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { CreateLeadResponseDto } from './dto/create-lead-response.dto';

const token = `00D52000000JQ0m!AQ8AQM.yk5sPLfpIjqCgMjYSV5m4YefsvQ_T3RFXvwfmBsZKhPD.H3Y8KTwKGZW5hFIVQRmOStqSYdDTXN8nPWEh__ad4X6W`;
const config = {
  headers: { Authorization: `Bearer ${process.env.TOKEN || token}` }
};
@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService,
    private readonly httpService: HttpService) {
      
    }

  @Post()
  create(@Body() createLeadDto: CreateLeadDto) {

    return this.httpService.axiosRef.post<CreateLeadResponseDto>(`https://hearstnp--test.sandbox.my.salesforce.com/services/data/v55.0/sobjects/Lead`,
      createLeadDto
      , config).then((r) => {
        return r.data;
      })
  }

  // @Get()
  // findAll() {
  //   return this.leadsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.leadsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
  //   return this.leadsService.update(+id, updateLeadDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.leadsService.remove(+id);
  // }
}
