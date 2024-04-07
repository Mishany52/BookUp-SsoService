import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/domains/token/dto/jwtPayload';
import { PayloadDto } from 'src/domains/token/dto/payloadDto';
// import { Request as RequestType } from 'express';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
    constructor(private readonly _config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true, // Expiration of the access_token is not checked when processing the refresh_token.
            secretOrKey: _config.get<string>('jwtAccessSecrete'),
        });
    }

    // private static _extractJWT(req: RequestType): string | null {
    //     if (req.cookies && 'refresh_token' in req.cookies && req.cookies.refresh_token.length > 0) {
    //         return req.cookies.refresh_token;
    //     }
    //     return null;
    // }

    public validate(payload: JwtPayload): PayloadDto {
        return { accountId: payload.sub, role: payload.role };
    }
}
