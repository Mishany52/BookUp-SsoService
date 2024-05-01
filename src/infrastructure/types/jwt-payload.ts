import { AccountRole } from 'src/domains/account/enums/account-role';

export type JwtPayload = {
    sub: string;
    role: AccountRole;
};
