import { Injectable } from '@nestjs/common';
import { Account } from 'src/infrastructure/types/account';
import { AccountRole } from '../../../../../domains/account/enums/account-role';
import { IAccount } from 'src/domains/interface/account/account.interface';

@Injectable()
export class GetAccountDto implements IAccount {
    phone: string;
    email: string;
    role: AccountRole;
    fio: string;
    imgUrl: string;
    constructor(model: Account) {
        this.email = model.email;
        this.role = model.role;
        this.fio = model.fio;
        this.imgUrl = model.imgUrl;
        this.phone = model.phone;
    }
}
