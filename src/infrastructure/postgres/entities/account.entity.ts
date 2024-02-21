import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: number;

    @Column()
    email: string;

    @Column()
    password_hash: string;
}
