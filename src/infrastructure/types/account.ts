import { AccountRole } from '../../domains/account/enums/account-role';
export type Account = {
    id: string;
    email: string;
    password: string;
    phone: string;
    imgUrl: string;
    role: AccountRole;
};
