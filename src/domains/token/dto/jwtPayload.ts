import { AccountRole } from 'src/domains/account/enums/account-role';

export interface JwtPayload {
    sub: string;
    role: AccountRole;
}
