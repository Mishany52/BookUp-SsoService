import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PayloadDto } from '../token/dto/payloadDto';

@Injectable()
export class AuthSerializer extends PassportSerializer {
    public serializeUser(user: PayloadDto, done: (err: Error | null, data?: PayloadDto) => void) {
        done(null, user);
    }
    public deserializeUser(
        data: PayloadDto,
        done: (err: Error | null, user?: PayloadDto) => PayloadDto,
    ): void {
        try {
            done(null, data);
        } catch (err) {
            done(<Error>err);
        }
    }
}
