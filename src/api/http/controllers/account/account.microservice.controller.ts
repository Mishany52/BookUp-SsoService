import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';

import { AccountIdDto } from 'src/api/http/controllers/dto/account/account-id.dto';
import { AccountService } from 'src/domains/account/account.service';
import { IAccountDeactivateByIdResponse } from 'src/domains/interface/account/account-deactivate-by-id-response.interface';
import { IAccountSearchByIdResponse } from 'src/domains/interface/account/account-search-by-id-response.interface';

@ApiTags('Accounts')
@Controller('account')
export class AccountMicroserviceController {
    constructor(private readonly _accountService: AccountService) {}
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

    @MessagePattern({ cmd: 'deactivate_account_by_id' })
    async deactivateAccount(accountId: UUID): Promise<IAccountDeactivateByIdResponse> {
        if (!accountId) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'account_deactivate_by_id_bad_request',
                data: null,
                errors: null,
            };
        }
        try {
            const account = await this._accountService.deactivate(accountId);
            if (!account) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'account_deactivate_by_id_not_found',
                    data: null,
                    errors: null,
                };
            }
            return {
                status: HttpStatus.OK,
                message: 'account_deactivate_by_id_success',
                data: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: 'account_deactivate_by_id_precondition_failed',
                data: null,
                errors: e.errors,
            };
        }
    }
}
