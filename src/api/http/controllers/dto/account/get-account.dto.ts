import { Injectable } from '@nestjs/common';
import { AccountRole } from '../../../../../domains/account/enums/account-role';
import { IAccount } from 'src/domains/interface/account/account.interface';
import { UUID } from 'crypto';

@Injectable()
export class GetAccountDto implements IAccount {
    id?: UUID;
    phone: string;
    email: string;
    role: AccountRole;
    fio: string;
    imgUrl: string;
    active: boolean;
    password: string;
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
