import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { GetAccountDto } from '../account/dtos/get-account.dto';
import { TokensService } from '../token/token.service';
import { Account } from 'src/infrastructure/types/account';
import { IAccountRepository } from '../account/account.repository.interface';
import { SingInDtoByPhone } from './dtos/sing-in-by-phone.dto';
import { SingInDtoByEmail } from './dtos/sign-on-by-email.dto';
import { PayloadDto } from '../token/dto/payloadDto';
import { JwtSign } from '../token/dto/tokensDto';
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
            throw new HttpException('The account has already been created', HttpStatus.CONFLICT);
        }
        const newAccount = await this._accountService.create(singUpDto);
        if (!newAccount) {
            throw new HttpException("The account didn't create", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const accountDto = new GetAccountDto(newAccount);
        return accountDto;
    }

    public async signIn(singInDto: SingInDtoByEmail | SingInDtoByPhone): Promise<JwtSign> {
        let account: Account;
        if ('email' in singInDto) {
            account = await this._accountRepository.getByEmail(singInDto.email);
        } else if ('phone' in singInDto) {
            account = await this._accountRepository.getByPhone(singInDto.phone);
        } else {
            throw new HttpException('Invalid sing-in data', HttpStatus.BAD_REQUEST);
        }
        if (!account) {
            throw new HttpException("The account didn't create", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const payload = new PayloadDto(account);
        const tokens = this._tokenService.generateTokens(payload);
        await this._tokenService.saveToken(tokens.refreshToken);
        return { ...tokens };
    }
    public jwtSing(payload: PayloadDto): JwtSign {
        return this._tokenService.generateTokens(payload);
    }
    public async validateAccount(accountEmail: string, password: string): Promise<Account | null> {
        if (!accountEmail) {
            throw new Error('Email or phone must be provided.');
        }
        let account: Account | null = null;

        account = await this._accountRepository.getByEmail(accountEmail);
        if (!account) {
            throw new HttpException('Account not found.', HttpStatus.NOT_FOUND);
        }

        if (account && (await this._accountService.checkPassword(password, account.password))) {
            return account;
        } else {
            return null;
        }
    }

    public async refresh(refreshToken: string): Promise<JwtSign> {
        const payload = this._tokenService.getPayload(refreshToken);
        const isAvailable = this._tokenService.validateRefreshToken(payload, refreshToken);
        if (!isAvailable) {
            throw new HttpException('Refresh is bad', HttpStatus.UNAUTHORIZED);
        }
        const newTokens = this._tokenService.generateTokens(payload);
        return newTokens;
    }

    public async logout(refreshToken: string): Promise<PayloadDto> {
        const payload = this._tokenService.getPayload(refreshToken);
        this._tokenService.deleteToken(refreshToken);
        return payload;
    }
}
