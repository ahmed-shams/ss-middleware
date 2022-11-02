import { ApiProperty } from "@nestjs/swagger";

export class FetchNominationDto {

    @ApiProperty({required:true})
    promotionId: number;

    @ApiProperty({required:true})
    organizationPromotionId: number;

    @ApiProperty({required:true})
    organizationId: number;
}