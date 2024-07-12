import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITokenRepository } from 'src/domains/token/token.repository.interface';
import { TokenEntity } from './token.entity';
import { Repository } from 'typeorm';
import { Token } from 'src/infrastructure/types/token';

@Injectable()
export class TokenRepository implements ITokenRepository {
    constructor(
        @InjectRepository(TokenEntity)
        private readonly _tokenRepository: Repository<TokenEntity>,
    ) {}
    async createToken(tokenData: Token): Promise<Token> {
        const token = this._tokenRepository.create(tokenData);
        try {
            return this._tokenRepository.save(token);
        } catch (error) {
            throw new Error('This mistake appeared when to save token');
        }
    }
    async deleteToken(tokenData: Partial<Token>): Promise<Token> {
        const rt = await this._tokenRepository.findOneBy({ refreshToken: tokenData.refreshToken });
        if (!rt) {
            throw new UnauthorizedException();
        }
        return this._tokenRepository.remove(rt);
    }

    async findToken(refreshToken: string): Promise<boolean> {
        const rt = this._tokenRepository.findOneBy({ refreshToken: refreshToken });
        if (!rt) {
            return false;
        }
        return true;
    }
}
