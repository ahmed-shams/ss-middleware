import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';


export class CreateCategoryDto {
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsDefined()
    @ApiProperty()
    salesForceId: string
}
