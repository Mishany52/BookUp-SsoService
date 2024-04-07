import { TokenRepository } from './repository';
import { Provider } from '@nestjs/common';

export const tokenRepoProvider: Provider = {
    provide: 'tokenRepo',
    useClass: TokenRepository,
};
