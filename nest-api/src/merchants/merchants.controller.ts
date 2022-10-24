import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('merchants')
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.create(createMerchantDto);
  }

  @Get()
  findAll() {
    return this.merchantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.merchantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantsService.update(id, updateMerchantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.merchantsService.remove(id);
  }
}
