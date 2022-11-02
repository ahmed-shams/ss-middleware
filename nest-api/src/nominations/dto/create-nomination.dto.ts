import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class CreateNominationDto {
    @ApiProperty({required:true})
    entityName: string;

    @MaxLength(55)
    @ApiProperty({ required: true, maxLength: 55 })
    category: string;

    @MaxLength(55)
    @ApiProperty({ required: true, type: Number, maxLength: 55 })
    voteCount: number;



    // @ApiProperty({type:Number,maxLength:11,required:true})
    // locationId: number;

    // @ApiProperty({type:Number,maxLength:11,required:true})
    // contestId: number;

    // @ApiPropertyOptional()
    // @MaxLength(4)
    // preloaded?:number;

    // @ApiPropertyOptional()
    // @MaxLength(11)
    // voteId?:number;

    // @ApiProperty({type:Number,maxLength:11,required:true})
    // catagoryId:number;

    // @ApiProperty({type:Number,maxLength:11,required:true})
    // merchantId:number;
}
