import { Provider } from '@nestjs/common';
import { AccountRepository } from './account.repository';

export const accountRepoProvider: Provider = {
    provide: 'accountRepo',
    useClass: AccountRepository,
};
