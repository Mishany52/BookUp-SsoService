import { Injectable, Inject } from '@nestjs/common';
import { Account } from '../../infrastructure/types/account';

// import { Repository } from 'typeorm';
import { IAccountRepository } from './account.repository.interface';
import * as argon2 from 'argon2';
import { CreateAccountDto } from './dtos/create-account.dto';

const accountRepo = () => Inject('accountRepo');

@Injectable()
export class AccountService {
    constructor(@accountRepo() private readonly _accountRepository: IAccountRepository) {}

    async checkPassword(plainPassword: string, checkPassword: string): Promise<boolean> {
        try {
            if (await argon2.verify(checkPassword, plainPassword)) {
                // password match
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error('Error verifying password:', err);
            // Return false or rethrow the error, depending on your application's requirements
            return false;
        }
    }

    async create(account: CreateAccountDto): Promise<Account> {
        const encrypted = account;
        encrypted.password = await argon2.hash(encrypted.password);
        return this._accountRepository.create(encrypted);
    }
    async isAccount(accountData: Partial<Account>): Promise<boolean> {
        if (!accountData.email && !accountData.phone) {
            return null;
        }
        const account = await this._accountRepository.getByEmailAndPhone(accountData);
        if (account) {
            return true;
        }
        return false;
    }

    async getAccounts(): Promise<Account[]> {
        return this._accountRepository.getAccounts();
    }
}
