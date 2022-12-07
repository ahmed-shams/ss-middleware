import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
@Entity()
export class Vote {


    @PrimaryGeneratedColumn('increment')
    @Column({ primary:true})
    id?: number;

    
    @Column({ nullable: false, type: 'varchar', length: 250 })
    entity_name: string;

    @Column({ nullable: false, type: 'varchar', length: 250 })
    category: string;


    @Column({type:'bigint'})
    entry_id: number;


    @Column({type:'nvarchar', length: 100})
    vote_date: string;

    @Column({type:'nvarchar', length:500})
    email: string;

    @Column({type:'varchar', length:100})
    ip_address: string;



    // @Column({ nullable: false, type: 'varchar', length: 500 })
    // address: string;
    

    // @Column({ name:'phone-number', nullable: false, type: 'varchar', length: 250 })
    // phoneNumber: string;

    // @Column({ name:'website', nullable: false, type: 'varchar', length: 250 })
    // website: string;
    
   
    // @Column({ nullable: false, type: 'int', default:1})
    // vote_count?: number;    
}
