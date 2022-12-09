import { ApiProperty } from "@nestjs/swagger";

export class CreateLogDto {

    @ApiProperty()
    message: string;

}
