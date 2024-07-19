import { UUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';

export interface IAccount {
    id?: UUID;
    role: AccountRole;
    email: string;
    phone: string;
    fio: string;
    imgUrl: string;
    active: boolean;
    password: string;
}
