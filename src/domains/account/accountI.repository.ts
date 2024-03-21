import { Account } from '../../Infrastructure/types/account';

export interface IAccountRepository {
    create(createFields: Partial<Account>): Promise<Account>;
    getByEmailAndPhone(accountData: Partial<Account>): Promise<Account>;
    getById(accountId: string): Promise<Account>;
    getAccounts(): Promise<Account[]>;
}
