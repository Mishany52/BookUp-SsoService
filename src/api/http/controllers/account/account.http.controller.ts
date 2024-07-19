import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountService } from 'src/domains/account/account.service';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/api/http/controllers/dto/account/get-account.dto';
import { reqAccount } from 'src/infrastructure/decorators/req-account.decorator';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { JwtAuthGuard } from 'src/guards/jwt-authenticated.guard';
import { UUID } from 'crypto';
import { UpdateAccountDto } from 'src/api/http/controllers/dto/account/update-account.dto';
import { IAccount } from 'src/domains/interface/account/account.interface';

@ApiTags('Accounts')
@Controller('account')
export class AccountHttpController {
    constructor(private readonly _accountService: AccountService) {}

    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiCreatedResponse({
        description: 'Accounts have been successfully received',
        type: [GetAccountDto],
    })
    @Post('list')
    async getAccounts(@Body() accountUuids: UUID[]): Promise<GetAccountDto[]> {
        const accounts = await this._accountService.getAccountsByIds(accountUuids);
        return accounts.map((account: IAccount) => {
            if (account.role == AccountRole.admin) {
                return;
            }
            return new GetAccountDto(account);
        });
    }

    @ApiOperation({ summary: 'Обновление аккаунта по id' })
    @ApiCreatedResponse({
        description: 'Account has been successfully updated',
        type: GetAccountDto,
    })
    @Put('update/:id')
    async update(
        @Param('id', ParseUUIDPipe) id: UUID,
        @Body() accountUpdateDto: UpdateAccountDto,
    ): Promise<GetAccountDto> {
        return this._accountService.updateAccount(id, accountUpdateDto);
    }

    @ApiOperation({ summary: 'Получение информации авторизированного пользователя' })
    @ApiCreatedResponse({
        description: 'Account has been successfully received',
        type: GetAccountDto,
    })
    @UseGuards(JwtAuthGuard)
    @Get('get-info')
    async findOneByToken(@reqAccount() req: PayloadDto): Promise<GetAccountDto> {
        return this._accountService.getAccountById(req.accountId);
    }
}
