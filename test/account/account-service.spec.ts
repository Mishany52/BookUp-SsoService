import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from 'src/domains/account/account.service';
import { AccountEntity } from '../../src/infrastructure/repository/account/account.entity';
import { AccountRepository } from 'src/infrastructure/repository/account/repository';
import { CreateAccountDto } from 'src/domains/account/dtos/create-account.dto';
import { Account } from '../../src/infrastructure/types/account';
import { randomUUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';

describe('AccountService', () => {
    let service: AccountService;

    const mockAccountRepo = {
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...dto,
                id: randomUUID(),
                role: AccountRole.client,
                imgUrl: null,
            } as Account;
        }),
        save: jest.fn().mockImplementation(async (account: Account) => Promise.resolve(account)),
        getByEmailAndPhone: jest.fn(),
        getByEmail: jest.fn(),
        getByPhone: jest.fn(),
        getById: jest.fn(),
        getAccounts: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                { provide: 'accountRepo', useClass: AccountRepository },
                {
                    provide: getRepositoryToken(AccountEntity),
                    useValue: mockAccountRepo,
                },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    // it('getByEmail => Should find an account and return its data', async () => {});
    it('create => Should create a new account and return its data', async () => {
        const createAccountDto = {
            email: 'user113@mail.ru',
            phone: '+79000000009',
            password: 'newpassword',
        } as CreateAccountDto;
        const result = await service.create(createAccountDto);
        const expectedAccount = {
            id: expect.stringMatching(
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
            ),
            password: expect.any(String),
            role: AccountRole.client,
            imgUrl: null,
        };
        const pass = await service.checkPassword(createAccountDto.password, result.password);
        expect(result).toEqual(expectedAccount);
        expect(pass).toEqual(true);
    }, 1000000);
});
