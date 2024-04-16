import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tokens' })
export class TokenEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    refreshToken: string;
    @Column()
    expiresAt: Date;
}
