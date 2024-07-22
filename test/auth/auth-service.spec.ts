import { mockDeep } from 'jest-mock-extended';
import { AccountService } from 'src/domains/account/account.service';
import { GetAccountDto } from 'src/api/http/controllers/dto/account/get-account.dto';
import { AuthService } from 'src/domains/auth/auth.service';
import { TokensService } from 'src/domains/token/token.service';
import { AccountRepository } from 'src/infrastructure/repository/account/account.repository';
import {
    ACCOUNT_ALREADY_CREATED,
    ACCOUNT_CREATION_FAILED,
    ACCOUNT_NOT_FOUND,
    ACCOUNT_NOT_FOUND_BY_EMAIL,
    EMAIL_OR_PHONE_REQUIRED,
    REFRESH_FAILED,
} from 'src/infrastructure/constants/http-messages/errors';
import { randomUUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { JwtSignDto } from '../../src/domains/token/dto/jwt-sign.dto';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { IAccount } from 'src/domains/interface/account/account.interface';

const mockAccountRep = mockDeep<AccountRepository>();
const mockAccountService = mockDeep<AccountService>();
const mockTokenService = mockDeep<TokensService>();

let service: AuthService;
const signUpDto = {
    email: 'hisEmailadress@yandex.com',
    password: 'password',
    phone: '+79000000000',
    fio: 'Иванов Иван Иванович',
    role: AccountRole.client,
};
const signInDtoByEmail = {
    email: 'hisEmailadress@yandex.com',
    password: 'password',
};
const signInDtoByPhone = {
    phone: '+79000000000',
    password: 'password',
};
const account: IAccount = {
    id: randomUUID(),
    email: 'hisEmailadress@yandex.com',
    password: 'hashed_password',
    phone: '+79000000000',
    role: AccountRole.client,
    imgUrl: null,
    fio: 'Иванов Иван Иванович',
};

const tokens = { refreshToken: 'refresh_token', accessToken: 'access_token' } as JwtSignDto;
const expectedAccountDto = new GetAccountDto({ ...signUpDto } as IAccount);
beforeEach(() => {
    service = new AuthService(mockAccountService, mockAccountRep, mockTokenService);
});
describe('AuthService', () => {
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('singUp', () => {
        test('successfully signUp => Should singUp a new account return its data', async () => {
            mockAccountService.create.mockResolvedValueOnce(expectedAccountDto);
            mockAccountService.isAccount.mockResolvedValueOnce(false);
            const result = await service.singUp(signUpDto);
            expect(result).toEqual(expectedAccountDto);
        });
        test('unsuccessfully singUp (account already existed) => Should return an error', async () => {
            mockAccountService.isAccount.mockResolvedValueOnce(true);
            const result = service.singUp(signUpDto);
            expect(result).rejects.toThrow(ACCOUNT_ALREADY_CREATED);
        });
        test('unsuccessfully singUp (creation of account failed) => Should return an error', async () => {
            mockAccountService.create.mockResolvedValueOnce(null);
            mockAccountService.isAccount.mockResolvedValueOnce(false);
            const result = service.singUp(signUpDto);
            expect(result).rejects.toThrow(ACCOUNT_CREATION_FAILED);
        });
    });

    describe('singIn', () => {
        test('successfully singIn by Email => Should create jwtTokens and return them', async () => {
            mockAccountRep.getByEmail.mockResolvedValueOnce(account);
            mockTokenService.generateTokens.mockReturnValueOnce(tokens);
            const payload = new PayloadDto(account);
            const result = await service.signIn(signInDtoByEmail);
            expect(mockTokenService.generateTokens).toHaveBeenCalledWith(payload);
            expect(mockTokenService.saveToken).toHaveBeenCalledWith(tokens.refreshToken);
            expect(result).toEqual(tokens);
        });
        test('successfully singIn by Phone => Should create jwtTokens and return them', async () => {
            mockAccountRep.getByPhone.mockResolvedValueOnce(account);
            mockTokenService.generateTokens.mockReturnValueOnce(tokens);
            const payload = new PayloadDto(account);
            const result = await service.signIn(signInDtoByPhone);
            expect(mockTokenService.generateTokens).toHaveBeenCalledWith(payload);
            expect(mockTokenService.saveToken).toHaveBeenCalledWith(tokens.refreshToken);
            expect(result).toEqual(tokens);
        });
        test('unsuccessfully singIn (Not found account by phone or email) => Should create jwtTokens and return them', async () => {
            mockAccountRep.getByPhone.mockResolvedValueOnce(null);
            mockAccountRep.getByEmail.mockResolvedValueOnce(null);

            const resultByPhone = service.signIn(signInDtoByPhone);
            const resultByEmail = service.signIn(signInDtoByEmail);

            expect(resultByPhone).rejects.toThrow(ACCOUNT_NOT_FOUND);
            expect(resultByEmail).rejects.toThrow(ACCOUNT_NOT_FOUND);
        });
    });

    describe('validateAccount', () => {
        test('successfully validate account => Should find account by email and check password', async () => {
            mockAccountRep.getByEmail.mockResolvedValueOnce(account);
            mockAccountService.checkPassword.mockResolvedValueOnce(true);

            const result = await service.validateAccount(
                signInDtoByEmail.email,
                signInDtoByEmail.password,
            );
            expect(mockAccountRep.getByEmail).toHaveBeenCalledWith(signInDtoByEmail.email);
            expect(mockAccountService.checkPassword).toHaveBeenCalledWith(
                signInDtoByEmail.password,
                account.password,
            );
            expect(result).toEqual(account);
        });
        test('unsuccessfully validate account (email is null) => Should throw an error ', async () => {
            const result = service.validateAccount('', signInDtoByEmail.password);
            expect(result).rejects.toThrow(EMAIL_OR_PHONE_REQUIRED);
        });
        test('unsuccessfully validate account (account not found) => Should throw an error', async () => {
            mockAccountRep.getByEmail.mockResolvedValueOnce(null);
            const result = service.validateAccount(
                signInDtoByEmail.email,
                signInDtoByEmail.password,
            );
            expect(result).rejects.toThrow(ACCOUNT_NOT_FOUND_BY_EMAIL);
        });
        test('unsuccessfully validate account (password is wrong) => Should throw an error', async () => {
            mockAccountRep.getByEmail.mockResolvedValueOnce(account);
            mockAccountService.checkPassword.mockResolvedValueOnce(false);
            const result = await service.validateAccount(
                signInDtoByEmail.email,
                signInDtoByEmail.password,
            );
            expect(result).toEqual(null);
        });
    });

    describe('refresh', () => {
        test('successfully refresh tokens => Should return new tokens', async () => {
            const refreshToken = 'oldToken';
            const payload = new PayloadDto(account);
            mockTokenService.validateRefreshToken.mockResolvedValueOnce(true);
            mockTokenService.generateTokens.mockReturnValueOnce(tokens);
            mockTokenService.getPayload.mockReturnValue(payload);

            const result = await service.refresh(refreshToken);
            expect(mockTokenService.getPayload).toHaveBeenCalledWith(refreshToken);
            expect(mockTokenService.validateRefreshToken).toHaveBeenCalledWith(
                payload,
                refreshToken,
            );
            expect(result).toEqual(tokens);
        });
        test('unsuccessfully refresh tokens (failed verification) => Should throw an error', async () => {
            const refreshToken = 'oldToken';
            const payload = new PayloadDto(account);
            mockTokenService.validateRefreshToken.mockResolvedValueOnce(false);
            mockTokenService.getPayload.mockReturnValue(payload);

            const result = service.refresh(refreshToken);
            expect(mockTokenService.getPayload).toHaveBeenCalledWith(refreshToken);
            expect(mockTokenService.validateRefreshToken).toHaveBeenCalledWith(
                payload,
                refreshToken,
            );
            expect(result).rejects.toThrow(REFRESH_FAILED);
        });
    });

    test('logout => Should return delete refresh token from db and return its payload', async () => {
        const refreshToken = 'oldToken';
        const payload = new PayloadDto(account);
        mockTokenService.getPayload.mockReturnValue(payload);

        const result = await service.logout(refreshToken);
        expect(mockTokenService.deleteToken).toHaveBeenCalledWith(refreshToken);
        expect(result).toEqual(payload);
    });
});
