import { PartialType } from '@nestjs/swagger';
import { CreateBuzzboardDto } from './create-buzzboard.dto';

export class UpdateBuzzboardDto extends PartialType(CreateBuzzboardDto) {}
