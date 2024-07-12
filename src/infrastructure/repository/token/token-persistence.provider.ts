import { TokenRepository } from './token.repository';
import { Provider } from '@nestjs/common';

export const tokenRepoProvider: Provider = {
    provide: 'tokenRepo',
    useClass: TokenRepository,
};
