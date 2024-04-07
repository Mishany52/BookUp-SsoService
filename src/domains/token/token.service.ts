import { Inject, Injectable } from '@nestjs/common';
import { ITokenRepository } from './token.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/infrastructure/types/token';
import { JwtSign } from './dto/tokensDto';
import { PayloadDto } from './dto/payloadDto';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './dto/jwtPayload';

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

    public generateTokens(payloadDto: PayloadDto): JwtSign {
        const payload: JwtPayload = { sub: payloadDto.accountId, role: payloadDto.role };

        const tokenRef = this._getRefreshToken(payload.sub);
        const tokenAcc = this._jwtService.sign(payload);
        return {
            refreshToken: tokenRef,
            accessToken: tokenAcc,
        };
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
            // throw new BadRequestException(
            //     "Payload from access isn't the same as in payload from refresh",
            // );
            return false;
        }
        const isToken = await this._tokenRepository.findToken(refreshToken);
        if (!isToken) {
            // throw new BadRequestException("Refresh token doesn't exist in db");
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
    // private _getAccessToken(data: JwtPayload): string {
    //     return this._jwtService.sign(
    //         { data },
    //         {
    //             secret: this._config.get('jwtAccessSecret'),
    //             expiresIn: this._config.get('jwtAccessExpires'),
    //         },
    //     );
    // }
}
