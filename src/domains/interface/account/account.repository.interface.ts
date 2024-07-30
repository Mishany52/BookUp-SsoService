import { UUID } from 'crypto';
import { IAccount } from './account.interface';

export interface IAccountRepository {
    create(createFields: Partial<IAccount>): Promise<IAccount>;
    update(accountUpdate: IAccount): Promise<IAccount>;
    getByEmailAndPhone(accountData: Partial<IAccount>): Promise<IAccount[]>;
    getByEmail(email: string): Promise<IAccount>;
    getByPhone(phone: string): Promise<IAccount>;
    getById(accountId: UUID): Promise<IAccount>;
    getAccountsByIds(accountId: UUID[]): Promise<IAccount[]>;
    checkAccountByEmailAndPhone(
        email: string,
        phone: string,
    ): Promise<{ emailTaken: boolean; phoneTaken: boolean }>;
}
