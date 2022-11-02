// import { Merchant } from "src/merchants/entities/merchant.entity";
// import { Category } from "src/categories/entities/category.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuditedEntity } from "src/entity/base-entity";

@Entity()
export class Nomination extends AuditedEntity {

    @PrimaryGeneratedColumn('increment')
    @Column({ primary:true})
    id: number;

    
    @Column({ nullable: false, type: 'varchar', length: 45 })
    entity_name: string;

    @Column({ nullable: false, type: 'varchar', length: 45 })
    category: string;

    @Column({ nullable: false, type: 'int', default:1})
    vote_count?: number;

    // @Column({ type:'integer'})
    // location_id: number;

    // @Column({ type:'integer' , nullable:true})
    // contest_id?: number;

    // @Column({ type:'tinyint', default: null})
    // preloaded: number;

    // @Column({ type:'integer', default:null})
    // vote_id: number;

    // @Column({ type:'integer'})
    // catagory_id: number;

    // @Column({type:'integer'})
    // merchant_id: number;

    // @ManyToOne(() => Merchant, (merchant) => merchant.id, { nullable: false })
    // public merchant?: Merchant;

    // @ManyToOne(() => Category, (category) => category.id, { nullable: false })
    // public category?: Category;
}
