import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
    BeforeUpdate,
    BeforeInsert,
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

interface AccountCreativeAttrs {
    email: string;
    password: string;
}
export enum AccountRole {
    owner = 'owner',
    admin = 'administrator',
    manager = 'manager',
    client = 'client',
}
@Entity({ name: 'accounts' })
export class Account {
    @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
    @Column({ type: 'varchar', length: 100})
    email: string;   
    
    @ApiProperty({ example: '$2b$10$jPZgCDZ/Qy15TQBLXj7KBe/A.ViAd02kQ42xZ1qIehoZ1eZrIzYXq', description: 'Пароль в базе' })
    @Column()
    @Exclude()
    password: string;

    @ApiProperty({ example: '+79000000000', description: 'Номер телефона' })
    @Column({type: 'varchar', length: 18})
    phone: string;

    //? Какой тип должен быть у ссылки и ее пример нужен
    @ApiProperty({ example: '', description: 'Ссылка на фотографию' })
    @Column({
        type: "varchar", nullable: true})
    imgUlr: string;

    @ApiProperty({
        example: 'Роль',
        description: 'Пользователь может быть owner, administrator, manager,employee',
    })
    @Column({
        type: 'enum',
        enum: AccountRole,
        default: AccountRole.client
    })
    role: AccountRole;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPasswordFunc(): Promise<void> {
        const salt = await bcrypt.genSalt();
        if (!/^\$2[abxy]?\$\d+\$/.test(this.password))
        {
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    
    async checkPassword(plainPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, this.password)
    }
}
