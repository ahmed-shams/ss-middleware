import { Entity, Column, PrimaryGeneratedColumn, PessimisticLockTransactionRequiredError } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable:false, length:45})
  name: string;

  @Column({nullable:false, name:'sales-force-id', length: 45})
  salesForceId: string;
}
