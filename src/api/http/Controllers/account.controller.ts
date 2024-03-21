import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../../domains/account/account.service';
import { Account } from 'src/Infrastructure/types/account';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/domains/account/dtos/get-account.dto';
@ApiTags('Accounts')
@Controller('account')
export class AccountController {
    constructor(private readonly _accountService: AccountService) {}
    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiResponse({ status: 200 })
    @Get()
    async getAll() {
        const accounts = await this._accountService.getAccounts();
        return accounts.map((account: Account) => {
            if (account.role == AccountRole.admin) {
                return;
            }
            return new GetAccountDto(account);
        });
    }
}
