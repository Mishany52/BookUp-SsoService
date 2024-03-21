import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AccountRole } from 'src/domains/account/enums/account-role';

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

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    patronymic: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;

    //? Какой тип должен быть у ссылки и ее пример нужен
    @Column({
        type: 'varchar',
        nullable: true,
    })
    imgUlr: string;

    @Column({
        type: 'enum',
        enum: AccountRole,
        default: AccountRole.client,
    })
    role: AccountRole;
}
