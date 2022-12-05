import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNominationRequestDto {
    @ApiProperty()
    promotionId: number;

    @ApiProperty()
    organizationPromotionId: number;

    @ApiProperty()
    organizationId: number;

    @ApiProperty()
    state: string;

    @ApiPropertyOptional()
    city: string;

    @ApiProperty()   
    contestTitle:string
}
