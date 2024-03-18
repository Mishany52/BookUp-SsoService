import { Injectable } from '@nestjs/common';
import { Account } from 'src/domains/account/account';
import { AccountEntity } from './account.entity';
import { SignUpDto } from 'src/api/http/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IAccountRepository } from 'src/domains/account/accountI.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @InjectRepository(AccountEntity)
        private readonly _accountRepository: Repository<AccountEntity>,
    ) {}

    async create(data: SignUpDto): Promise<Account> {
        const account = this._accountRepository.create(data);
        try {
            await this._accountRepository.save(account);
            //!Потом сменить на mapper
            const createdUser: Account = { ...account }; // Assuming simple mapping
            return createdUser;
        } catch (error) {
            throw new Error("User doesn't create");
        }
    }
    async getByEmailAndPhone(accountData: Partial<Account>): Promise<Account> {
        try {
            const account = await this._accountRepository.findOne({
                where: [{ email: accountData.email }, { phone: accountData.phone }],
            });
            return account;
        } catch (error) {
            throw new Error('This mistake appeared when to find user by email&phone');
        }
    }
    async getById(accountId: string): Promise<Account> {
        try {
            const account = await this._accountRepository.findOne({
                where: { id: accountId },
            });
            return account;
        } catch (error) {
            throw new Error('Account does not find by id');
        }
    }
}
