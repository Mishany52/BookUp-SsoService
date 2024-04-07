import { Token } from 'src/infrastructure/types/token';
export interface ITokenRepository {
    deleteToken(token: Partial<Token>): Promise<Token>;
    createToken(tokenData: Partial<Token>): Promise<Token>;
    findToken(refreshToken: string): Promise<boolean>;
}
