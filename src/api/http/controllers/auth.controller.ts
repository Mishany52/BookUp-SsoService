import { Body, Controller, Post, UseGuards, Res, Get, Req, HttpStatus } from '@nestjs/common';
import { SignUpDto } from './dto/auth/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/domains/auth/auth.service';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { Response as ResponseType, Request as RequestType } from 'express';
import { SingInDtoByEmail } from 'src/api/http/controllers/dto/auth/sign-on-by-email.dto';
import { AccessTokenDto } from 'src/domains/dtos/access-token.dto';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { JwtAuthGuard } from 'src/guards/jwt-authenticated.guard';
import { EXPIRE_TIME } from 'src/infrastructure/constants/auth/jwt.constants';
import { MessagePattern } from '@nestjs/microservices';
import { IAccountSingUpResponse } from 'src/domains/interface/account/account-sign-up.response.interface';
import { SingInDtoByPhone } from './dto/auth/sing-in-by-phone.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
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
    @Post('sign-in')
    public async jwtLogin(
        @Body() accountDto: SingInDtoByEmail | SingInDtoByPhone,
        @Res({ passthrough: true }) res: ResponseType,
    ): Promise<AccessTokenDto> {
        const tokens = await this._authService.signIn(accountDto);
        const expireTime = await this._authService.getExpiresDate(EXPIRE_TIME);

        res.cookie('refresh_token', tokens.refreshToken, {
            expires: expireTime,
        });
        const accessDto = new AccessTokenDto(tokens);
        return accessDto;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    public async refresh(
        @Req() req: RequestType,
        @Res({ passthrough: true }) res: ResponseType,
    ): Promise<string> {
        const refresh: string = req.cookies.refresh_token;
        const tokens = await this._authService.refresh(refresh);
        const expireTime = await this._authService.getExpiresDate(EXPIRE_TIME);

        res.cookie('refresh_token', refresh, {
            expires: expireTime,
        });

        return tokens.accessToken;
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    public logout(@Req() req: RequestType): Promise<PayloadDto> {
        const refresh: string = req.cookies.refresh_token;
        return this._authService.logout(refresh);
    }
}
