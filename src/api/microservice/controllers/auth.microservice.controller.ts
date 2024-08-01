import { Controller, HttpStatus, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from 'src/api/http/controllers/dto/auth/sign-up.dto';
import { MicroserviceLoggerInterceptor } from 'src/common/logger/microservice-logger';
import { AuthService } from 'src/domains/auth/auth.service';
import { IAccountSingUpResponse } from 'src/domains/interface/account/account-sign-up.response.interface';
import { SING_UP_BAD_REQUEST } from 'src/infrastructure/constants/microservice-messages/response-auth.messages';
import { SING_UP_SUCCESS } from 'src/infrastructure/constants/microservice-messages/response-auth.messages';

@ApiTags('Authentication')
@Controller('authMicroservice')
@UseInterceptors(MicroserviceLoggerInterceptor)
export class AuthMicroserviceController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 201 })
    @MessagePattern({ cmd: 'auth_sing_up' })
    async signUp(signUpDto: SignUpDto): Promise<IAccountSingUpResponse> {
        if (!signUpDto || Object.keys(signUpDto).length === 0) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: SING_UP_BAD_REQUEST,
                data: null,
                errors: null,
            };
        }
        try {
            const account = await this._authService.singUp(signUpDto);
            if (!account) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: SING_UP_BAD_REQUEST,
                    data: null,
                    errors: null,
                };
            }
            return {
                status: HttpStatus.OK,
                message: SING_UP_SUCCESS,
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
