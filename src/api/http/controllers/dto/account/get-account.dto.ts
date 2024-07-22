import { Injectable } from '@nestjs/common';
import { AccountRole } from '../../../../../domains/account/enums/account-role';
import { IAccount } from 'src/domains/interface/account/account.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

@Injectable()
export class GetAccountDto implements IAccount {
    @ApiProperty({
        example: 'fe18f1eb-2090-4d97-b9a1-d2a1387e4fb4',
    })
    id?: UUID;
    @ApiProperty({
        uniqueItems: true,
        example: '+79000000000',
    })
    phone: string;
    @ApiProperty({
        uniqueItems: true,
        example: 'test@gmail.com',
    })
    email: string;
    @ApiProperty({
        enum: AccountRole,
        example: AccountRole.owner,
    })
    role: AccountRole;
    @ApiProperty({
        example: 'Иванов Иван Иванович',
    })
    fio: string;
    @ApiProperty({
        example: 'Пока не знаем',
    })
    imgUrl: string;

    @ApiProperty({
        example: true,
    })
    active: boolean;
    constructor(model: IAccount) {
        this.id = model.id;
        this.email = model.email;
        this.role = model.role;
        this.fio = model.fio;
        this.imgUrl = model.imgUrl;
        this.phone = model.phone;
        this.active = model.active;
    }
}
