import { PartialType } from '@nestjs/swagger';
import { CreateMerchantDto } from './create-merchant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';


export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    id: string;
}

