import { Injectable, Inject } from '@nestjs/common';
import { Account } from '../../Infrastructure/types/account';

// import { Repository } from 'typeorm';
import { IAccountRepository } from './accountI.repository';
import * as argon2 from 'argon2';
import { CreateAccountDto } from './dtos/create-account.dto';

const accountRepo = () => Inject('accountRepo');

@Injectable()
export class AccountService {
    constructor(@accountRepo() private readonly _accountRepository: IAccountRepository) {}
    async checkPassword(plainPassword: string): Promise<boolean> {
        try {
            if (await argon2.verify('<big long hash>', plainPassword)) {
                // password match
                return true;
            } else {
                throw new Error("Password is't correct");
            }
        } catch (err) {
            // internal failure
        }
    }

    async create(account: CreateAccountDto): Promise<Account> {
        const encrypted = account;
        encrypted.password = await argon2.hash(encrypted.password);
        return await this._accountRepository.create(encrypted);
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
        return await this._accountRepository.getAccounts();
    }
}
