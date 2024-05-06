import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from 'src/domains/account/account.service';
import { AccountEntity } from '../../src/infrastructure/repository/account/account.entity';
import { AccountRepository } from 'src/infrastructure/repository/account/repository';
import { CreateAccountDto } from 'src/domains/account/dtos/create-account.dto';
import { Account } from '../../src/infrastructure/types/account';
import { randomUUID } from 'crypto';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { Repository } from 'typeorm';

describe('AccountService', () => {
    let service: AccountService;
    let repository: Repository<Account>;

    const mockAccountRepo = {
        create: jest.fn().mockImplementation((dto) => {
            return {
                ...dto,
                id: randomUUID(),
                role: AccountRole.client,
                imgUrl: null,
            } as Account;
        }),
        save: jest
            .fn()
            .mockImplementation(
                async (account: Account): Promise<Account> => Promise.resolve(account),
            ),
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
        repository = module.get<Repository<Account>>(getRepositoryToken(AccountEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAccount', () => {
        const createAccountDto = {
            email: 'user113@mail.ru',
            phone: '+79000000009',
            password: 'newpassword',
        } as CreateAccountDto;

        beforeEach(() => {
            jest.spyOn(repository, 'save').mockImplementationOnce(
                async (account: Account): Promise<Account> => account,
            );
        });
        it('successfully create => Should create a new account and return its data', async () => {
            const expectedAccount = {
                id: expect.stringMatching(
                    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
                ),
                password: expect.any(String),
                role: AccountRole.client,
                imgUrl: null,
            };

            const result = await service.create(createAccountDto);
            const pass = await service.checkPassword(createAccountDto.password, result.password);

            expect(result).toEqual(expectedAccount);
            expect(pass).toEqual(true);
        }, 100000);
    });

    // describe('getAccount => Should return an account by id', () => {
    //     const createAccountDto = {
    //         email: 'user113@mail.ru',
    //         phone: '+79000000009',
    //         password: 'newpassword',
    //     } as CreateAccountDto;
    //     const newAccount = mockAccountRepo.create(createAccountDto) as Account;

    //     it('works', async () => {
    //         jest.spyOn(repository, 'findOne').mockResolvedValueOnce(newAccount);
    //         const getUser = await service.getAccount(newAccount.id as UUID);
    //         expect(getUser.email).toEqual(createAccountDto.email);
    //         expect(getUser.role).toEqual(AccountRole.client);
    //     });
    // });
});
