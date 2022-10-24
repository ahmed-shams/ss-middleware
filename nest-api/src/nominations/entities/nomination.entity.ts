import { Merchant } from "src/merchants/entities/merchant.entity";
import { Category } from "src/categories/entities/category.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Nomination {

    @PrimaryGeneratedColumn('increment')
    @Column({ primary:true})
    id: number;

    @Column({ type:'text'})
    buzzboard_info: string;

    @Column({ type:'integer'})
    location_id: number;

    @Column({ type:'integer' , nullable:true})
    contest_id?: number;

    @Column({ type:'tinyint', default: null})
    preloaded: number;

    @Column({ type:'integer', default:null})
    vote_id: number;

    @Column({ type:'integer'})
    catagory_id: number;

    @Column({type:'integer'})
    merchant_id: number;

    @ManyToOne(() => Merchant, (merchant) => merchant.id, { nullable: false })
    public merchant?: Merchant;

    @ManyToOne(() => Category, (category) => category.id, { nullable: false })
    public category?: Category;
}
