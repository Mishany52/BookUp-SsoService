import { mockDeep } from 'jest-mock-extended';
import { AccountService } from 'src/domains/account/account.service';
import { AccountRepository } from 'src/infrastructure/repository/account/repository';
import { CreateAccountDto } from 'src/domains/account/dtos/create-account.dto';
import { Account } from '../../src/infrastructure/types/account';
import { UUID, randomUUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/domains/account/dtos/get-account.dto';
import {
    ACCOUNT_NOT_FOUND_BY_ID,
    ACCOUNTS_NOT_FOUND_BY_IDS,
} from '../../src/infrastructure/constants/http-messages/errors';
import { v4 as uuidv4 } from 'uuid';
import * as argon2 from 'argon2';

const mockAccountRep = mockDeep<AccountRepository>();
jest.mock('argon2', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
}));

let service: AccountService;

const account: Account = {
    id: randomUUID(),
    email: 'hisEmailadress@yandex.com',
    password: 'hashed_password',
    phone: '+79000000000',
    role: AccountRole.client,
    imgUrl: null,
};

const createAccountDto = {
    email: 'hisEmailadress@yandex.com',
    password: 'password',
    phone: '+79000000000',
} as CreateAccountDto;

const expectedGetAccountDto = new GetAccountDto(account);

const accounts: Account[] = [
    {
        id: expect.stringMatching(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
        ),
        email: 'hisEmailadress@yandex.com',
        password: 'hashed_password',
        phone: '+79000000000',
        role: AccountRole.client,
        imgUrl: null,
    },
    {
        id: expect.stringMatching(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
        ),
        email: 'myEmailadress@yandex.com',
        password: 'hashed_password',
        phone: '+79000000001',
        role: AccountRole.client,
        imgUrl: null,
    },
];

beforeEach(() => {
    service = new AccountService(mockAccountRep);
});

describe('AccountService', () => {
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAccount', () => {
        test('successfully create => Should create a new account, hash password and return its data', async () => {
            mockAccountRep.create.mockImplementationOnce(
                async (createAccountDto: CreateAccountDto): Promise<Account> => {
                    return {
                        ...createAccountDto,
                        id: randomUUID(),
                        role: AccountRole.client,
                        imgUrl: null,
                    } as Account;
                },
            );
            const result = await service.create(createAccountDto);

            expect(result).toEqual(expectedGetAccountDto);
            expect(argon2.hash).toHaveBeenCalledWith(createAccountDto.password);
            expect(mockAccountRep.create).toHaveBeenCalledWith({
                ...createAccountDto,
                password: account.password,
            });
        });
    });

    describe('getAccount by id', () => {
        test('should successfully return a valid account given a valid account uuid', async () => {
            mockAccountRep.getById.mockImplementationOnce(async (uuid: UUID): Promise<Account> => {
                return {
                    ...account,
                    id: uuid,
                };
            });
            const uuid = randomUUID();
            const expectedAccount = new GetAccountDto({ ...account, id: uuid });
            const result = await service.getAccountById(uuid);
            expect(result).toEqual(expectedAccount);
        });
        test('should return an error if account not found', async () => {
            mockAccountRep.getById.mockResolvedValueOnce(null);
            const uuid = randomUUID();
            expect(service.getAccountById(uuid)).rejects.toThrow(ACCOUNT_NOT_FOUND_BY_ID);
        });
    });

    describe('getAccounts by ids', () => {
        test('should successfully return a valid accounts given valid account uuids', async () => {
            mockAccountRep.getAccountsByIds.mockImplementationOnce(
                async (uuids: UUID[]): Promise<Account[]> => {
                    accounts.forEach((account, index) => {
                        // eslint-disable-next-line security/detect-object-injection
                        account.id = uuids[index];
                    });
                    return accounts;
                },
            );
            const uuids = accounts.map(() => uuidv4() as UUID);
            const expectedAccounts = accounts.map((account) => new GetAccountDto(account));
            const result = await service.getAccountsByIds(uuids);
            expect(result).toEqual(expectedAccounts);
        });
        test('should return an error if account not found', async () => {
            mockAccountRep.getAccountsByIds.mockResolvedValueOnce(null);
            const uuids = accounts.map(() => uuidv4() as UUID);
            expect(service.getAccountsByIds(uuids)).rejects.toThrow(ACCOUNTS_NOT_FOUND_BY_IDS);
        });
    });

    describe('updateAccount', () => {
        test('should the password be cached if it is provided with other data, and the account data should be updated', async () => {
            mockAccountRep.getById.mockImplementationOnce(async (uuid: UUID): Promise<Account> => {
                return {
                    ...account,
                    id: uuid,
                };
            });
            mockAccountRep.save.mockImplementationOnce(
                async (accountDto: Account): Promise<Account> => {
                    return accountDto;
                },
            );
            const newAccountData = {
                email: 'doyouloveyourself@yes.ido',
                password: 'weWillFinishOurProject',
            };
            const uuid = uuidv4() as UUID;
            const result = await service.updateAccount(uuid, { ...newAccountData });
            const expectedAccount = new GetAccountDto({ ...account, email: newAccountData.email });

            expect(result).toEqual(expectedAccount);
            expect(argon2.hash).toHaveBeenCalledWith(newAccountData.password);
            expect(mockAccountRep.save).toHaveBeenCalledWith(
                expect.objectContaining({ password: 'hashed_password' }),
            );
        });

        test('should throw an HttpException if update fails', async () => {
            const uuid = randomUUID();
            mockAccountRep.getById.mockResolvedValueOnce(null);
            const result = service.updateAccount(uuid, { email: 'newEmail@gmail.com' });
            expect(result).rejects.toThrow(ACCOUNT_NOT_FOUND_BY_ID);
        });
    });
});
