import { Body, Controller, Post, Get } from '@nestjs/common'
import { SignUpDto } from '../dto/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';

@ApiTags('Аккаунты')
@Controller('account')
export class AccountController{
  constructor(
    private accountsService: AccountService
  ) { }
  @ApiOperation({summary: 'Создание аккаунта'})
  @ApiResponse({ status: 200, type: Account })
  @Post("/signUp")
  signUp(@Body() accountDto: SignUpDto): Promise<Account> {
    return this.accountsService.createAccount(accountDto)
  }
}