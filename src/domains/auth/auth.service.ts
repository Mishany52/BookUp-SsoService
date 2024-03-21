import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { GetAccountDto } from '../account/dtos/get-account.dto';

@Injectable()
export class AuthService {
    constructor(private readonly _accountService: AccountService) {}

    async singUp(singUpDto: SignUpDto): Promise<GetAccountDto> {
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
}
