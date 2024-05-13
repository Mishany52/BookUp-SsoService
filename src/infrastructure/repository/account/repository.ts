import { Injectable } from '@nestjs/common';
import { Account } from 'src/infrastructure/types/account';
import { AccountEntity } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domains/account/account.repository.interface';
import { In, Repository } from 'typeorm';
import { CreateAccountDto } from 'src/domains/account/dtos/create-account.dto';
import {
    ACCOUNT_CREATION_FAILED,
    ACCOUNT_NOT_FOUND,
    ACCOUNT_NOT_FOUND_BY_EMAIL,
    ACCOUNT_NOT_FOUND_BY_ID,
    ACCOUNT_NOT_FOUND_BY_PHONE,
    ACCOUNT_NOT_UPDATE,
} from 'src/infrastructure/constants/http-messages/errors';
import { UUID } from 'crypto';

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly _accountRepository: Repository<AccountEntity>,
    ) {}

    async create(createDto: CreateAccountDto): Promise<Account> {
        const account = this._accountRepository.create(createDto);
        try {
            this._accountRepository.save(account);
            //!Потом сменить на mapper
            const createdUser: Account = { ...account }; // Assuming simple mapping
            return createdUser;
        } catch (error) {
            throw new Error(ACCOUNT_CREATION_FAILED);
        }
    }
    async save(accountUpdate: Account): Promise<Account> {
        try {
            const account = await this._accountRepository.save(accountUpdate);
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_UPDATE);
        }
    }
    async getByEmailAndPhone(accountData: Partial<Account>): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: [{ email: accountData.email }, { phone: accountData.phone }],
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND);
        }
    }
    async getById(accountId: UUID): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { id: accountId },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_ID);
        }
    }
    async getByEmail(accountEmail: string): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { email: accountEmail },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_EMAIL);
        }
    }
    async getByPhone(accountPhone: string): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { phone: accountPhone },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_PHONE);
        }
    }
    async getAccountsByIds(accountsIds: UUID[]): Promise<Account[]> {
        return await this._accountRepository.findBy({ id: In([accountsIds]) });
    }
}
