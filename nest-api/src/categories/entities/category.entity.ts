import { type } from 'os';
import { Entity, Column, PrimaryGeneratedColumn, PessimisticLockTransactionRequiredError } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment',)
  @Column({nullable:false, primary:true})
  id: number;

  @Column({nullable:false, type:'varchar', length:45})
  name: string;

  @Column({nullable:false, type:'varchar', name:'sales-force-id', length: 45})
  salesForceId: string;
}
