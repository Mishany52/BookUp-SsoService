import { User } from './User';

export interface IUserRepository {
    create(createFields: Partial<User>): Promise<User>;
    getByEmailAndPhone(userData: Partial<User>): Promise<User>;
    // getById(userId: string): Promise<User>;
}
