import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { JwtPayload } from 'src/infrastructure/types/jwt-payload';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
    constructor(private readonly _config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    let token = null;
                    if (req && req.cookies) {
                        token = req.cookies['refresh_token']; // Используйте нужное имя cookie
                    }
                    return token;
                },
            ]),
            ignoreExpiration: true, // Expiration of the access_token is not checked when processing the refresh_token.
            secretOrKey: _config.get<string>('jwtRefreshSecrete'),
        });
    }

    public validate(payload: JwtPayload): PayloadDto {
        return { accountId: payload.sub, role: payload.role };
    }
}
