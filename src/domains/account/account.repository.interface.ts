import { UUID } from 'crypto';
import { Account } from '../../infrastructure/types/account';

export interface IAccountRepository {
    create(createFields: Partial<Account>): Promise<Account>;
    save(accountUpdate: Account): Promise<Account>;
    getByEmailAndPhone(accountData: Partial<Account>): Promise<Account>;
    getByEmail(email: string): Promise<Account>;
    getByPhone(phone: string): Promise<Account>;
    getById(accountId: UUID): Promise<Account>;
    getAccountsByIds(accountId: UUID[]): Promise<Account[]>;
}
