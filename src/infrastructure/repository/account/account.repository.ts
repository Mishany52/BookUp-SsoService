import { Injectable } from '@nestjs/common';
import { AccountEntity } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domains/interface/account/account.repository.interface';
import { In, Repository } from 'typeorm';
import { CreateAccountDto } from 'src/api/http/controllers/dto/account/create-account.dto';
import {
    ACCOUNT_CREATION_FAILED,
    ACCOUNT_NOT_FOUND,
    ACCOUNT_NOT_FOUND_BY_EMAIL,
    ACCOUNT_NOT_FOUND_BY_ID,
    ACCOUNT_NOT_FOUND_BY_PHONE,
    ACCOUNT_NOT_UPDATE,
} from 'src/infrastructure/constants/http-messages/errors.constants';
import { UUID } from 'crypto';
import { IAccount } from 'src/domains/interface/account/account.interface';

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly _accountRepository: Repository<AccountEntity>,
    ) {}

    async create(createDto: CreateAccountDto): Promise<IAccount> {
        const account = this._accountRepository.create(createDto);
        try {
            const accountSaved = await this._accountRepository.save(account);
            //!Потом сменить на mapper
            const createdAccount: IAccount = { ...accountSaved };
            return createdAccount;
        } catch (error) {
            throw new Error(ACCOUNT_CREATION_FAILED);
        }
    }
    async update(accountUpdate: IAccount): Promise<IAccount> {
        try {
            const account = await this._accountRepository.save(accountUpdate);
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_UPDATE);
        }
    }
    async getByEmailAndPhone(accountData: Partial<IAccount>): Promise<IAccount | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: [{ email: accountData.email }, { phone: accountData.phone }],
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND);
        }
    }
    async getById(accountId: UUID): Promise<IAccount | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { id: accountId },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_ID);
        }
    }
    async getByEmail(accountEmail: string): Promise<IAccount | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { email: accountEmail },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_EMAIL);
        }
    }
    async getByPhone(accountPhone: string): Promise<IAccount | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { phone: accountPhone },
            });
            return account;
        } catch (error) {
            throw new Error(ACCOUNT_NOT_FOUND_BY_PHONE);
        }
    }
    async getAccountsByIds(accountsIds: UUID[]): Promise<IAccount[]> {
        return await this._accountRepository.find({ where: { id: In(accountsIds) } });
    }
}
