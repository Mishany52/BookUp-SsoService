import { UUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';

export interface IAccount {
    id?: UUID;
    email: string;
    phone: string;
    password?: string;
    fio: string;
    role: AccountRole;
    imgUrl?: string;
    active?: boolean;
}
