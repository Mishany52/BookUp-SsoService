import { UUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';

export type JwtPayload = {
    sub: UUID;
    role: AccountRole;
};
