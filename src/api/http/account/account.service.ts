import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { SignUpDto } from '../dto/sign-up.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AccountService {
    constructor(
      @InjectRepository(Account)
      private readonly accountRepository: Repository<Account>,
    ) {}

    async createAccount(data: SignUpDto): Promise<Account> {
        const account = this.accountRepository.create(data);
        return this.accountRepository.save(account);
    }
}
