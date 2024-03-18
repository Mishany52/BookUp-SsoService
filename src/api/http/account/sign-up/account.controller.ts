import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../../dto/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../../../domains/account/account.service';
import { Account } from 'src/domains/account/account';
@ApiTags('Аккаунты')
@Controller('account')
export class AccountController {
    constructor(private readonly _accountService: AccountService) {}
    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 200 })
    @Post('/sign-up')
    signUp(@Body() signUpDto: SignUpDto): Promise<Account> {
        console.log(signUpDto);
        return this._accountService.create(signUpDto);
    }
}
