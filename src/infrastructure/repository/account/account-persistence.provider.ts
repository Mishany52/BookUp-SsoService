import { Provider } from '@nestjs/common';
import { AccountRepository } from './repository';

export const accountRepoProvider: Provider = {
    provide: 'accountRepo',
    useClass: AccountRepository,
};
