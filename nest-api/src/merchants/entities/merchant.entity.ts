import { Entity, Column, PrimaryGeneratedColumn, PessimisticLockTransactionRequiredError } from 'typeorm';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn('increment')
  @Column({type:'integer', primary:true})
  id: number;

  @Column({nullable:false, length:45})
  name: string;

  @Column({nullable:false, name:'sales-force-id', length: 45})
  salesForceId: string;
}
