import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../../../domains/account/account.service';
import { Account } from 'src/infrastructure/types/account';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { GetAccountDto } from 'src/api/http/controllers/dto/account/get-account.dto';
import { reqAccount } from 'src/infrastructure/decorators/req-account.decorator';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { JwtAuthGuard } from '../../../guards/jwt-authenticated.guard';
import { UUID } from 'crypto';
import { AccountUpdateDto } from 'src/api/http/controllers/dto/account/update-account.dto';
import { MessagePattern } from '@nestjs/microservices';

import { AccountIdDto } from 'src/api/http/controllers/dto/account/account-id.dto';
import { IAccountSearchByIdResponse } from 'src/domains/interface/account/account-search-by-id-response.interface';
@ApiTags('Accounts')
@Controller('account')
export class AccountController {
    constructor(private readonly _accountService: AccountService) {}
    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiResponse({ status: 200 })
    @Post()
    async getAccounts(@Body() accountUuids: UUID[]) {
        const accounts = await this._accountService.getAccountsByIds(accountUuids);
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

    @MessagePattern({ cmd: 'account_search_by_account_id' })
    async findOne(accountDto: AccountIdDto): Promise<IAccountSearchByIdResponse> {
        if (!accountDto.accountId) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'account_search_id_bad_request',
                account: null,
                errors: null,
            };
        }
        try {
            const account = await this._accountService.getAccountById(accountDto.accountId);

            if (!account) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'account_search_by_id_not_found',
                    account: null,
                    errors: null,
                };
            }

            return {
                status: HttpStatus.OK,
                message: 'account_search_by_id_success',
                account: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: 'account_search_by_id_precondition_failed',
                account: null,
                errors: e.errors,
            };
        }
    }
}
