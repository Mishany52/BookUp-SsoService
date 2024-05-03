import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AccountRole } from '../../../domains/account/enums/account-role';

@Entity({ name: 'accounts' })
export class AccountEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false })
    @Exclude()
    password: string;

    @Column({ type: 'varchar', length: 18, unique: true, nullable: false })
    phone: string;

    //? Какой тип должен быть у ссылки и ее пример нужен
    @Column({
        type: 'text',
        nullable: true,
    })
    imgUrl: string;

    @Column({
        type: 'enum',
        enum: AccountRole,
        default: AccountRole.client,
    })
    role: AccountRole;
}
