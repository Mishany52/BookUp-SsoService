import { Account } from './account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Иван', description: 'Имя' })
  @Column({type: "varchar", length: 50})
  firstName: string;

  @ApiProperty({ example: 'Иванович', description: 'Отчество' })
  @Column({type: "varchar", length: 50})
  patronymic: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия' })
  @Column({type: "varchar", length: 50})
  lastName: string;

  @OneToOne(type => Account)
  @JoinColumn()
  account: Account;
  
}