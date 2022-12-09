import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log {

    @PrimaryGeneratedColumn('increment')
    @Column({type:'integer', primary:true})
    pk_id?: number;
    
    @Column({type:'varchar', length: 250})
    id: string;

    @Column({ nullable: false, type: 'varchar', length: 1000 })
    message: string;

    @Column({ nullable: false, type: 'datetime', default: () => "CURRENT_TIMESTAMP" })
    createdAt?: Date;


}
