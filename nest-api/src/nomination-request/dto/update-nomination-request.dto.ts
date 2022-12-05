import { PartialType } from '@nestjs/swagger';
import { CreateNominationRequestDto } from './create-nomination-request.dto';

export class UpdateNominationRequestDto extends PartialType(CreateNominationRequestDto) {}
