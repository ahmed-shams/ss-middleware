import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, MaxLength } from 'class-validator';
import { CreateNominationDto } from './create-nomination.dto';

export class UpdateNominationDto extends PartialType(CreateNominationDto) {
    @IsNotEmpty()
    @IsDefined()
    @ApiProperty({maxLength:11, type: Number })
    @MaxLength(11)
    id: number;

}
