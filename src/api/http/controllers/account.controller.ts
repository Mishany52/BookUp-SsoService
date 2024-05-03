import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../../domains/account/account.service';
import { Account } from 'src/infrastructure/types/account';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/domains/account/dtos/get-account.dto';
import { reqAccount } from 'src/infrastructure/decorators/req-account.decorator';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { JwtAuthGuard } from '../../../guards/jwt-authenticated.guard';
import { UUID } from 'crypto';
import { AccountUpdateDto } from 'src/domains/account/dtos/update-account.dto';
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

    @UseGuards(JwtAuthGuard)
    @Get('check-jwt')
    helloJwt(@reqAccount() req: PayloadDto): string {
        return 'Hello World ' + req.accountId;
    }

    @Put('update/:id')
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body(ValidationPipe) accountUpdateDto: AccountUpdateDto,
    ): Promise<GetAccountDto> {
        return this._accountService.updateAccount(id, accountUpdateDto);
    }

    @Get('get-info/:id')
    async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<GetAccountDto> {
        return this._accountService.getAccount(id);
    }
}
