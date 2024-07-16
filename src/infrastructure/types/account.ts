import { UUID } from 'crypto';
import { AccountRole } from '../../domains/account/enums/account-role';
export type Account = {
    id: UUID;
    email: string;
    password: string;
    phone: string;
    imgUrl: string;
    role: AccountRole;
};
