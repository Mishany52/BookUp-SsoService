import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _authService: AuthService) {
        super({ usernameField: 'email', passwordField: 'password' });
    }

    public async validate(
        accountEmail: string,
        password: string,
        // accountPhone?: string,
    ): Promise<PayloadDto> {
        const account = await this._authService.validateAccount(accountEmail, password);
        if (!account) {
            throw new HttpException('Incorrect password.', HttpStatus.UNAUTHORIZED);
        }
        return { accountId: account.id, role: account.role };
    }
}
