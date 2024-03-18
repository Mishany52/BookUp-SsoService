import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Account } from './account';
import { SignUpDto } from 'src/api/http/dto/sign-up.dto';
// import { Repository } from 'typeorm';
import { IAccountRepository } from './accountI.repository';
import * as argon2 from 'argon2';

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
    async hashPasswordFunc(password: string): Promise<string> {
        if (!/^\$2[abxy]?\$\d+\$/.test(password)) {
            return await argon2.hash(password);
        }
    }
    async create(data: SignUpDto): Promise<Account> {
        const tmp = await this._accountRepository.getByEmailAndPhone(data);
        if (!tmp) {
            const hashPass = await this.hashPasswordFunc(data.password);
            data.password = hashPass;
            return await this._accountRepository.create(data);
        }
        throw new BadRequestException('Email or phone already exists');
    }
}
