import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { AccountEmailAndPhoneDto } from 'src/api/http/controllers/dto/account/account-email-and-phone.dto';

import { AccountIdDto } from 'src/api/http/controllers/dto/account/account-id.dto';
import { UpdateAccountDto } from 'src/api/http/controllers/dto/account/update-account.dto';
import { AccountService } from 'src/domains/account/account.service';
import { IAccountDeactivateByIdResponse } from 'src/domains/interface/account/account-deactivate-by-id-response.interface';
import { IAccountCheckByEmailPhoneResponse } from 'src/domains/interface/account/account-is-by-email-and-phone-response.interface';
import { IAccountSearchByIdResponse } from 'src/domains/interface/account/account-search-by-id-response.interface';
import { IAccountUpdateByIdResponse } from 'src/domains/interface/account/account-update-by-id-response.interface';
import { AccountMessages } from 'src/infrastructure/constants/microservice-messages/response-account.messages';

@ApiTags('Accounts')
@Controller('account')
export class AccountMicroserviceController {
    constructor(private readonly _accountService: AccountService) {}
    @MessagePattern({ cmd: 'account_search_by_account_id' })
    async findOneById(accountDto: AccountIdDto): Promise<IAccountSearchByIdResponse> {
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
                status: e.status,
                message: e.messages,
                account: null,
                errors: e.errors,
            };
        }
    }

    @MessagePattern({ cmd: 'check_account_by_email_and_phone' })
    async checkAccountEmailAndPhone(
        accountDto: AccountEmailAndPhoneDto,
    ): Promise<IAccountCheckByEmailPhoneResponse> {
        if (!accountDto.email && !accountDto.phone) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: AccountMessages.CHECK_EMAIL_PHONE_BAD_REQUEST,
                data: null,
                errors: null,
            };
        }
        try {
            const isAccount = await this._accountService.getAccountByEmailAndPhone({
                email: accountDto.email,
                phone: accountDto.phone,
            });

            return {
                status: HttpStatus.OK,
                message: AccountMessages.CHECK_EMAIL_PHONE_SUCCESS,
                data: isAccount,
                errors: null,
            };
        } catch (e) {
            return {
                status: e.status,
                message: e.messages,
                data: null,
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
                status: e.status,
                message: e.messages,
                data: null,
                errors: e.errors,
            };
        }
    }

    @MessagePattern({ cmd: 'update_account_by_id' })
    async update(updateAccountDto: UpdateAccountDto): Promise<IAccountUpdateByIdResponse> {
        if (!updateAccountDto.id) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: AccountMessages.UPDATE_BY_ID_BAD_REQUEST,
                data: null,
                errors: null,
            };
        }
        try {
            const account = await this._accountService.updateAccount(
                updateAccountDto.id,
                updateAccountDto,
            );
            if (!account) {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: AccountMessages.UPDATE_BY_ID_NOT_FOUND,
                    data: null,
                    errors: null,
                };
            }
            return {
                status: HttpStatus.OK,
                message: AccountMessages.UPDATE_BY_ID_SUCCESS,
                data: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: e.status,
                message: e.message,
                data: null,
                errors: e.errors,
            };
        }
    }
}
