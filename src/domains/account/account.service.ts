import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Account } from '../../infrastructure/types/account';

import { IAccountRepository } from './account.repository.interface';
import * as argon2 from 'argon2';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UUID } from 'crypto';
import { GetAccountDto } from './dtos/get-account.dto';
import { ACCOUNT_NOT_FOUND } from 'src/infrastructure/constants/http-messages/errors';

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
    async getAccount(accountId: UUID): Promise<GetAccountDto> {
        const account = await this._accountRepository.getById(accountId);
        if (!account) {
            throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return new GetAccountDto(account);
    }
    async getAccounts(): Promise<Account[]> {
        return this._accountRepository.getAccounts();
    }
}
