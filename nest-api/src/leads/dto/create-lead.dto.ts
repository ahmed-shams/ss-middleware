import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateLeadDto {

    @ApiProperty()
    Company: string;

    @ApiProperty()
    LastName: string;

    @ApiPropertyOptional()
    phoneNumber?: string;

    @ApiPropertyOptional()
    address?: string;

    @ApiPropertyOptional()
    website?: string;
}
