import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../../domains/account/account.service';
import { Account } from 'src/infrastructure/types/account';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/domains/account/dtos/get-account.dto';
import { AuthenticatedGuard } from 'src/guards/session-authenticated.guard';
import { reqAccount } from 'src/infrastructure/decorators/req-account.decorator';
import { PayloadDto } from 'src/domains/token/dto/payloadDto';
import { JwtAuthGuard } from '../../../guards/jwt-authenticated.guard';
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
    // @UseGuards(AuthenticatedGuard)
    @Get('check-session')
    helloSession(@reqAccount() req: PayloadDto): string {
        return 'Hello World ' + req.accountId;
    }
    @UseGuards(JwtAuthGuard)
    @Get('check-jwt')
    helloJwt(@reqAccount() req: PayloadDto): string {
        return 'Hello World ' + req.accountId;
    }
}
