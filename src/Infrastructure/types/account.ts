import { AccountRole } from '../../domains/account/enums/account-role';
export type Account = {
    id: string;
    firstName: string;
    patronymic: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    imgUlr: string;
    role: AccountRole;
};
