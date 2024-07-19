import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AccountRole } from '../../../domains/account/enums/account-role';

import { IAccount } from 'src/domains/interface/account/account.interface';
import { MinLength } from 'class-validator';
import { UUID } from 'crypto';
@Entity({ name: 'accounts' })
export class AccountEntity implements IAccount {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    @Exclude()
    password: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    @MinLength(11)
    phone: string;

    @Column({ type: 'varchar', nullable: false })
    fio: string;

    //? Какой тип должен быть у ссылки и ее пример нужен
    @Column({
        type: 'text',
        nullable: true,
    })
    imgUrl: string;

    @Column({
        type: 'enum',
        enum: AccountRole,
    })
    role: AccountRole;
    @Column({
        type: 'boolean',
        default: true,
    })
    active: boolean;
}
