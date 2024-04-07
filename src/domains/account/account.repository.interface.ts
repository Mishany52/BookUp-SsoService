import { Account } from '../../infrastructure/types/account';

export interface IAccountRepository {
    create(createFields: Partial<Account>): Promise<Account>;
    getByEmailAndPhone(accountData: Partial<Account>): Promise<Account>;
    getByEmail(email: string): Promise<Account>;
    getByPhone(phone: string): Promise<Account>;
    getById(accountId: string): Promise<Account>;
    getAccounts(): Promise<Account[]>;
}
