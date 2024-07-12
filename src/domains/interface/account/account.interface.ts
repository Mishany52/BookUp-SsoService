import { AccountRole } from 'src/domains/account/enums/account-role';

export interface IAccount {
    id?: string;
    role: AccountRole;
    email: string;
    phone: string;
    fio: string;
    imgUrl: string;
}
