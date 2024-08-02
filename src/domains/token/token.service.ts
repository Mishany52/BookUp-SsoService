import { Inject, Injectable } from '@nestjs/common';
import { ITokenRepository } from './token.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/infrastructure/types/token';
import { JwtSignDto } from './dto/jwt-sign.dto';
import { PayloadDto } from './dto/payload.dto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../infrastructure/types/jwt-payload';

const tokenRepo = () => Inject('tokenRepo');
@Injectable()
export class TokensService {
    constructor(
        @tokenRepo()
        private readonly _tokenRepository: ITokenRepository,
        private readonly _jwtService: JwtService,
        private readonly _config: ConfigService,
    ) {}
    public async saveToken(tokenRefresh: string): Promise<Token> {
        return await this._tokenRepository.createToken({
            refreshToken: tokenRefresh,
            //!Нужно сделать правильное смешение времени с использованием this._config.get('jwtRefreshExpires')
            expiresAt: new Date(),
        });
    }
    public async deleteToken(tokenRefresh: string): Promise<Token> {
        return await this._tokenRepository.deleteToken({ refreshToken: tokenRefresh });
    }

    public generateTokens(payloadDto: PayloadDto): JwtSignDto {
        const payload: JwtPayload = { sub: payloadDto.accountId, role: payloadDto.role };

        const tokenRef = this._getRefreshToken(payload.sub);
        const tokenAcc = this._jwtService.sign(payload);
        return {
            refreshToken: tokenRef,
            accessToken: tokenAcc,
        };
    }

    public validateAccessToken(accessToken: string) {
        if (
            !this._jwtService.verify(accessToken, {
                secret: this._config.get('jwtAccessSecret'),
            })
        ) {
            return false;
        }

        const payload = this._jwtService.decode<{ sub: string }>(accessToken);
        return payload;
    }

    public async validateRefreshToken(data: PayloadDto, refreshToken: string): Promise<boolean> {
        if (
            !this._jwtService.verify(refreshToken, {
                secret: this._config.get('jwtRefreshSecrete'),
            })
        ) {
            return false;
        }

        const payload = this._jwtService.decode<{ sub: string }>(refreshToken);
        if (payload.sub != data.accountId) {
            return false;
        }
        const isToken = await this._tokenRepository.findToken(refreshToken);
        if (!isToken) {
            return false;
        }
        return true;
    }

    public getPayload(token: string): PayloadDto | null {
        try {
            const payload = this._jwtService.decode<JwtPayload | null>(token);
            if (!payload) {
                return null;
            }
            return { accountId: payload.sub, role: payload.role };
        } catch (error) {
            throw new Error('This mistake appeared when trying to get payload from token');
        }
    }

    private _getRefreshToken(sub: string): string {
        return this._jwtService.sign(
            { sub },
            {
                secret: this._config.get('jwtRefreshSecrete'),
                expiresIn: this._config.get('jwtRefreshExpires'),
            },
        );
    }
}
