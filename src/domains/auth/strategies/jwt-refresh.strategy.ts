import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { JwtPayload } from 'src/infrastructure/types/jwt-payload';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(Strategy, 'jwt-verify') {
    constructor(private readonly _config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true, // Expiration of the access_token is not checked when processing the refresh_token.
            secretOrKey: _config.get<string>('jwtAccessSecrete'),
        });
    }

    public validate(payload: JwtPayload): PayloadDto {
        return { accountId: payload.sub, role: payload.role };
    }
}
