import { PartialType } from '@nestjs/swagger';
import { CreateMerchantDto } from './create-merchant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Max, MaxLength, maxLength } from 'class-validator';


export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty({maxLength:11, type: Number })
    @MaxLength(11)
    id: number;
}

