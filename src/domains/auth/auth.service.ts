import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { SignUpDto } from '../../api/http/controllers/dto/auth/sign-up.dto';
import { GetAccountDto } from '../../api/http/controllers/dto/account/get-account.dto';
import { TokensService } from '../token/token.service';
import { IAccountRepository } from '../interface/account/account.repository.interface';
import { SingInDtoByPhone } from '../../api/http/controllers/dto/auth/sing-in-by-phone.dto';
import { SingInDtoByEmail } from '../../api/http/controllers/dto/auth/sign-on-by-email.dto';
import { PayloadDto } from '../token/dto/payload.dto';
import { JwtSignDto } from '../token/dto/jwt-sign.dto';
import {
    INVALID_SIGN_IN_DATA,
    ACCOUNT_ALREADY_CREATED,
    EMAIL_OR_PHONE_REQUIRED,
    ACCOUNT_CREATION_FAILED,
    ACCOUNT_NOT_FOUND,
    REFRESH_FAILED,
    ACCOUNT_NOT_FOUND_BY_EMAIL,
} from 'src/infrastructure/constants/http-messages/errors.constants';
import { IAccount } from '../interface/account/account.interface';
const accountRepo = () => Inject('accountRepo');
@Injectable()
export class AuthService {
    constructor(
        private readonly _accountService: AccountService,
        @accountRepo() private readonly _accountRepository: IAccountRepository,
        private readonly _tokenService: TokensService,
    ) {}

    public async singUp(singUpDto: SignUpDto): Promise<GetAccountDto> {
        const isAccount = await this._accountService.isAccount(singUpDto);
        if (isAccount) {
            throw new HttpException(ACCOUNT_ALREADY_CREATED, HttpStatus.CONFLICT);
        }
        const newAccount = await this._accountService.create(singUpDto);
        if (!newAccount) {
            throw new HttpException(ACCOUNT_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return newAccount;
    }

    public async signIn(singInDto: SingInDtoByEmail | SingInDtoByPhone): Promise<JwtSignDto> {
        let account: IAccount;
        if ('email' in singInDto) {
            account = await this._accountRepository.getByEmail(singInDto.email);
        } else if ('phone' in singInDto) {
            account = await this._accountRepository.getByPhone(singInDto.phone);
        } else {
            throw new HttpException(INVALID_SIGN_IN_DATA, HttpStatus.BAD_REQUEST);
        }

        if (!account) {
            throw new HttpException(ACCOUNT_NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const payload = new PayloadDto(account);
        const tokens = this._tokenService.generateTokens(payload);
        await this._tokenService.saveToken(tokens.refreshToken);
        return { ...tokens };
    }
    public jwtSing(payload: PayloadDto): JwtSignDto {
        return this._tokenService.generateTokens(payload);
    }
    public async validateAccount(accountEmail: string, password: string): Promise<IAccount | null> {
        if (!accountEmail) {
            throw new Error(EMAIL_OR_PHONE_REQUIRED);
        }
        let account: IAccount | null = null;

        account = await this._accountRepository.getByEmail(accountEmail);
        if (!account) {
            throw new HttpException(ACCOUNT_NOT_FOUND_BY_EMAIL, HttpStatus.NOT_FOUND);
        }

        if (account && (await this._accountService.checkPassword(password, account.password))) {
            return account;
        } else {
            return null;
        }
    }

    public async refresh(refreshToken: string): Promise<JwtSignDto> {
        const payload = this._tokenService.getPayload(refreshToken);
        const isAvailable = await this._tokenService.validateRefreshToken(payload, refreshToken);
        if (!isAvailable) {
            throw new HttpException(REFRESH_FAILED, HttpStatus.UNAUTHORIZED);
        }
        const newTokens = this._tokenService.generateTokens(payload);
        return newTokens;
    }

    public async logout(refreshToken: string): Promise<PayloadDto> {
        const payload = this._tokenService.getPayload(refreshToken);
        this._tokenService.deleteToken(refreshToken);
        return payload;
    }

    public async getExpiresDate(expireTime: number): Promise<Date> {
        return new Date(Date.now() + expireTime);
    }
}
