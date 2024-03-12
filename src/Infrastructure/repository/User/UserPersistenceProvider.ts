import { Provider } from '@nestjs/common';
import { UserRepository } from './Repository';

export const userRepoProvider: Provider = {
    provide: 'userRepo',
    useClass: UserRepository,
};
