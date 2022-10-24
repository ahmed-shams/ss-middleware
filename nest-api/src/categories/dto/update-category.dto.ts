import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty({type:Number, maxLength: 45})
    @MaxLength(45)
    id: number;
}
