import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';

import { AccountIdDto } from 'src/api/http/controllers/dto/account/account-id.dto';
import { AccountService } from 'src/domains/account/account.service';
import { IAccountDeactivateByIdResponse } from 'src/domains/interface/account/account-deactivate-by-id-response.interface';
import { IAccountSearchByIdResponse } from 'src/domains/interface/account/account-search-by-id-response.interface';
import { AccountMessages } from 'src/infrastructure/constants/microservice-messages/response-account.messages';

@ApiTags('Accounts')
@Controller('account')
export class AccountMicroserviceController {
    constructor(private readonly _accountService: AccountService) {}
    @MessagePattern({ cmd: 'account_search_by_account_id' })
    async findOne(accountDto: AccountIdDto): Promise<IAccountSearchByIdResponse> {
        if (!accountDto.accountId) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: AccountMessages.SEARCH_ID_BAD_REQUEST,
                account: null,
                errors: null,
            };
        }
        try {
            const account = await this._accountService.getAccountById(accountDto.accountId);

            if (!account) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: AccountMessages.SEARCH_BY_ID_NOT_FOUND,
                    account: null,
                    errors: null,
                };
            }

            return {
                status: HttpStatus.OK,
                message: AccountMessages.SEARCH_BY_ID_FOUND,
                account: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: AccountMessages.SEARCH_BY_ID_PRECONDITION_FAILED,
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
                message: AccountMessages.DEACTIVATE_BY_ID_BAD_REQUEST,
                data: null,
                errors: null,
            };
        }
        try {
            const account = await this._accountService.deactivate(accountId);
            if (!account) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: AccountMessages.DEACTIVATE_BY_ID_NOT_FOUND,
                    data: null,
                    errors: null,
                };
            }
            return {
                status: HttpStatus.OK,
                message: AccountMessages.DEACTIVATE_BY_ID_SUCCESS,
                data: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: HttpStatus.PRECONDITION_FAILED,
                message: AccountMessages.DEACTIVATE_BY_ID_PRECONDITION_FAILED,
                data: null,
                errors: e.errors,
            };
        }
    }
}
