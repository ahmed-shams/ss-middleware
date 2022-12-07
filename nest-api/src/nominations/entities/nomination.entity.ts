// import { Merchant } from "src/merchants/entities/merchant.entity";
// import { Category } from "src/categories/entities/category.entity";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AuditedEntity } from "src/entity/base-entity";

@Index("category_entity_name_UNIQUE", ["category", "entity_name"], { unique: true })
@Entity()
export class Nomination extends AuditedEntity {

    //city?,state,businnessname

    @PrimaryGeneratedColumn('increment')
    @Column({ primary:true})
    id?: number;

    
    @Column({ nullable: false, type: 'nvarchar', length: 500 })
    entity_name: string;

    @Column({ nullable: false, type: 'varchar', length: 250 })
    category: string;

    @Column({ nullable: false, type: 'varchar', length: 500 })
    address: string;
    

    @Column({ name:'phone-number', nullable: false, type: 'varchar', length: 250 })
    phoneNumber: string;

    @Column({ name:'website', nullable: false, type: 'varchar', length: 250 })
    website: string;
    
   
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
