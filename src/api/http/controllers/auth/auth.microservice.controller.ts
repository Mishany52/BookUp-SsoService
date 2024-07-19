import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../dto/auth/sign-up.dto';
import { AuthService } from 'src/domains/auth/auth.service';
import { IAccountSingUpResponse } from 'src/domains/interface/account/account-sign-up.response.interface';

@ApiTags('Authentication')
@Controller('authMicroservice')
export class AuthMicroserviceController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 201 })
    @MessagePattern({ cmd: 'account_sing_up' })
    async signUp(signUpDto: SignUpDto): Promise<IAccountSingUpResponse> {
        if (!signUpDto || Object.keys(signUpDto).length === 0) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'account_sign_up_bad_request',
                data: null,
                errors: null,
            };
        }
        try {
            const account = await this._authService.singUp(signUpDto);
            if (!account) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: 'account_sign_up_bad_request',
                    data: null,
                    errors: null,
                };
            }
            return {
                status: HttpStatus.OK,
                message: 'account_sign_up_success',
                data: account,
                errors: null,
            };
        } catch (e) {
            return {
                status: e.status,
                message: e.response,
                data: null,
                errors: e.errors,
            };
        }
    }
}
