import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { IAccountRepository } from '../interface/account/account.repository.interface';
import * as argon2 from 'argon2';
import { CreateAccountDto } from '../../api/http/controllers/dto/account/create-account.dto';
import { UUID } from 'crypto';
import { GetAccountDto } from '../../api/http/controllers/dto/account/get-account.dto';
import { UpdateAccountDto } from '../../api/http/controllers/dto/account/update-account.dto';
import {
    ACCOUNTS_NOT_FOUND_BY_IDS,
    ACCOUNT_NOT_FOUND_BY_ID,
    ACCOUNT_NOT_UPDATE,
    EMAIL_OR_PHONE_BUSY,
} from '../../infrastructure/constants/http-messages/errors';
import { IAccount } from '../interface/account/account.interface';

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

    async create(account: CreateAccountDto): Promise<GetAccountDto> {
        const hashPassword = await argon2.hash(account.password);
        const newAccount = await this._accountRepository.create({
            ...account,
            password: hashPassword,
        });
        const getAccountDto = new GetAccountDto(newAccount);
        return getAccountDto;
    }
    async deactivate(accountId: UUID): Promise<GetAccountDto> {
        const account = await this.getAccountById(accountId);

        const accountUpdate = await this._accountRepository.update({ ...account, active: false });

        if (!accountUpdate) {
            throw new HttpException(ACCOUNT_NOT_UPDATE, HttpStatus.BAD_REQUEST);
        }
        return new GetAccountDto(account);
    }

    async isAccount(accountData: Partial<IAccount>): Promise<boolean> {
        if (!accountData.email && !accountData.phone) {
            return null;
        }
        const account = await this._accountRepository.getByEmailAndPhone(accountData);
        if (account) {
            return true;
        }
        return false;
    }
    async getAccountById(accountId: UUID): Promise<GetAccountDto> {
        const account = await this._accountRepository.getById(accountId);
        if (!account) {
            throw new HttpException(ACCOUNT_NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        }
        return new GetAccountDto(account);
    }
    async getAccountsByIds(accountIds: UUID[]): Promise<GetAccountDto[]> {
        const accounts = await this._accountRepository.getAccountsByIds(accountIds);
        if (!accounts) {
            throw new HttpException(ACCOUNTS_NOT_FOUND_BY_IDS, HttpStatus.NOT_FOUND);
        }
        const accountsDto = accounts.map((account) => new GetAccountDto(account));
        return accountsDto;
    }

    async updateAccount(
        accountId: UUID,
        accountUpdateDto: Partial<UpdateAccountDto>,
    ): Promise<GetAccountDto> {
        const account = await this._accountRepository.getById(accountId);
        if (!account) {
            throw new HttpException(ACCOUNT_NOT_FOUND_BY_ID, HttpStatus.NOT_FOUND);
        }
        if (accountUpdateDto.password.length != 0) {
            accountUpdateDto.password = await argon2.hash(accountUpdateDto.password);
        }

        const accountByPhoneAndEmail = await this._accountRepository.getByEmailAndPhone({
            email: accountUpdateDto.email,
            phone: accountUpdateDto.phone,
        });
        if (accountByPhoneAndEmail) {
            throw new HttpException(EMAIL_OR_PHONE_BUSY, HttpStatus.BAD_REQUEST);
        }

        // Обновляем поля сущности
        Object.assign(account, accountUpdateDto);

        const accountUpdate = await this._accountRepository.update(account);
        if (!accountUpdate) {
            throw new HttpException(ACCOUNT_NOT_UPDATE, HttpStatus.BAD_REQUEST);
        }
        return new GetAccountDto(account);
    }
}
