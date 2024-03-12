import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from '../Profile/profile.entity';
import { UserRole } from 'src/domains/user/UserRole';

@Entity({ name: 'users' })
export class UserEntity {
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
        enum: UserRole,
        default: UserRole.client,
    })
    role: UserRole;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile;
}
