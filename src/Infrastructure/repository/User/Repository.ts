import { Injectable } from '@nestjs/common';
import { User } from 'src/domains/user/User';
import { UserEntity } from './user.entity';
import { SignUpDto } from 'src/api/http/dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from 'src/domains/user/IUserRepository';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
    ) {}

    async create(data: SignUpDto): Promise<User> {
        const user = this._userRepository.create(data);
        try {
            await this._userRepository.save(user);
            //!Потом сменить на mapper
            const createdUser: User = { ...user }; // Assuming simple mapping
            return createdUser;
        } catch (error) {
            throw new Error("User doesn't create");
        }
    }
    async getByEmailAndPhone(userData: Partial<User>): Promise<User> {
        try {
            const user = this._userRepository.findOne({
                where: {
                    email: userData.email,
                    phone: userData.phone,
                },
            });
            return user;
        } catch (error) {
            throw new Error('This mistake appeared when to find user by email&phone');
        }
    }
    // async async getById(userId: string): Promise<User> {
    //     const user = this.
    // }
}
