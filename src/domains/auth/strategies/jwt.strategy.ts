import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/domains/token/dto/jwtPayload';
import { PayloadDto } from 'src/domains/token/dto/payloadDto';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
            ignoreExpiration: false,
            secretOrKey: _config.get<string>('jwtAccessSecrete'),
        });
    }
    public validate(payload: JwtPayload): PayloadDto {
        return { accountId: payload.sub, role: payload.role };
    }
}
