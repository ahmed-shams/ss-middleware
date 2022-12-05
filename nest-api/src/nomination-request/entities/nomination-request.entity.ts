import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class NominationRequest {

    @PrimaryGeneratedColumn('increment')
    @Column({type:'integer', primary:true})
    id: number;
    
    @Column({ nullable: false, type: 'integer'})
    promotionId: number;

    @Column({ nullable: false, type: 'integer' })
    organizationPromotionId: number;

    @Column({ nullable: false, type: 'integer' })
    organizationId: number;

    @Column({nullable:false, type:'varchar', length:45})
    state: string;

    @Column({nullable:false, type:'varchar', length:45})
    city: string;

    @Column({nullable:false, type:'varchar', length:45})
    contestTitle: string;

}
