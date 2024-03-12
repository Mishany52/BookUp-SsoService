import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    firstName: string;

    @Column({ type: 'varchar', length: 50 })
    patronymic: string;

    @Column({ type: 'varchar', length: 50 })
    lastName: string;
}
