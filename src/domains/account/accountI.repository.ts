import { Account } from './account';

export interface IAccountRepository {
    create(createFields: Partial<Account>): Promise<Account>;
    getByEmailAndPhone(userData: Partial<Account>): Promise<Account>;
    getById(accountId: string): Promise<Account>;
}
