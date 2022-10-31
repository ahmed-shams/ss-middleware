import { ApiProperty } from "@nestjs/swagger";

export class CreateLeadResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    errors: Array<string>
}
