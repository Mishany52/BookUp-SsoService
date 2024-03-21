import { Injectable } from '@nestjs/common';
import { Account } from 'src/Infrastructure/types/account';
import { AccountEntity } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domains/account/accountI.repository';
import { Repository } from 'typeorm';
import { CreateAccountDto } from 'src/domains/account/dtos/create-account.dto';

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly _accountRepository: Repository<AccountEntity>,
    ) {}

    async create(createDto: CreateAccountDto): Promise<Account> {
        const account = this._accountRepository.create(createDto);
        try {
            await this._accountRepository.save(account);
            //!Потом сменить на mapper
            const createdUser: Account = { ...account }; // Assuming simple mapping
            return createdUser;
        } catch (error) {
            throw new Error("User doesn't create");
        }
    }
    async getByEmailAndPhone(accountData: Partial<Account>): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: [{ email: accountData.email }, { phone: accountData.phone }],
            });
            return account;
        } catch (error) {
            throw new Error('This mistake appeared when to find user by email&phone');
        }
    }
    async getById(accountId: string): Promise<Account | undefined> {
        try {
            const account = await this._accountRepository.findOne({
                where: { id: accountId },
            });
            return account;
        } catch (error) {
            throw new Error('Account does not find by id');
        }
    }

    async getAccounts(): Promise<Account[]> {
        //!Когда сессию сделаю будем возвращать только активных пользователей
        // return await this._accountRepository.find({
        //     relations: ['sessions'],
        // });
        return await this._accountRepository.find({});
    }
}
