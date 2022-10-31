import { ApiProperty } from "@nestjs/swagger";

export class CreateLeadDto {

    @ApiProperty()
    Company: string;

    @ApiProperty()
    LastName: string;
}
