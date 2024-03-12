import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { User } from 'src/domains/user/User';
import { SignUpDto } from 'src/api/http/dto/sign-up.dto';
// import { Repository } from 'typeorm';
import { IUserRepository } from './IUserRepository';
import * as argon2 from 'argon2';

const userRepo = () => Inject('userRepo');

@Injectable()
export class UserService {
    constructor(@userRepo() private readonly _userRepository: IUserRepository) {}
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
    async create(data: SignUpDto): Promise<User> {
        const tmp = await this._userRepository.getByEmailAndPhone(data);
        if (!tmp) {
            const hashPass = await this.hashPasswordFunc(data.password);
            data.password = hashPass;
            return await this._userRepository.create(data);
        }
        throw new BadRequestException('Email or phone already exists');
    }
}
