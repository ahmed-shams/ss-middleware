import { ApiProperty } from "@nestjs/swagger";

export class CreateBuzzboardDto {

    @ApiProperty({type:String})
    BusinessName: string;

    @ApiProperty({type:String})
    City: string;
}
