import { Body, Controller, Post, UseGuards, Res, Get, Req } from '@nestjs/common';
import { SignUpDto } from '../dto/auth/sign-up.dto';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiExtraModels,
    ApiOperation,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from 'src/domains/auth/auth.service';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { Response as ResponseType, Request as RequestType } from 'express';
import { SingInDtoByEmail } from 'src/api/http/controllers/dto/auth/sign-on-by-email.dto';
import { AccessTokenDto } from 'src/domains/dtos/access-token.dto';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { JwtAuthGuard } from 'src/guards/jwt-authenticated.guard';
import { EXPIRE_TIME } from 'src/infrastructure/constants/auth/jwt.constants';
import { SingInDtoByPhone } from '../dto/auth/sing-in-by-phone.dto';
import { GetAccountDto } from '../dto/account/get-account.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthHttpController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Регистрация аккаунта' })
    @ApiCreatedResponse({
        description: 'Account have been successfully created',
        type: GetAccountDto,
    })
    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto): Promise<GetAccountDto> {
        return this._authService.singUp(signUpDto);
    }

    @ApiOperation({ summary: 'Вход в аккаунта (возможен вход по телефону смотреть Schema)' })
    @ApiCreatedResponse({
        description: 'Account have been successfully sign-in',
        type: AccessTokenDto,
    })
    @ApiExtraModels(SingInDtoByEmail, SingInDtoByPhone)
    @ApiBody({
        schema: {
            oneOf: [
                {
                    $ref: getSchemaPath(SingInDtoByEmail),
                },
                {
                    $ref: getSchemaPath(SingInDtoByPhone),
                },
            ],
        },
    })
    @Post('sign-in')
    public async signIn(
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

    @ApiOperation({ summary: 'Обновление токена' })
    @ApiCreatedResponse({
        description: 'Access token',
        type: AccessTokenDto,
    })
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    public async refresh(
        @Req() req: RequestType,
        @Res({ passthrough: true }) res: ResponseType,
    ): Promise<AccessTokenDto> {
        const refresh: string = req.cookies.refresh_token;
        const tokens = await this._authService.refresh(refresh);
        const expireTime = await this._authService.getExpiresDate(EXPIRE_TIME);

        res.cookie('refresh_token', tokens.refreshToken, {
            expires: expireTime,
        });
        const accessDto = new AccessTokenDto(tokens);

        return accessDto;
    }
    @ApiOperation({ summary: 'Выход из аккаунта с удалением из куки токена' })
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    public logout(@Req() req: RequestType): Promise<PayloadDto> {
        const refresh: string = req.cookies.refresh_token;
        return this._authService.logout(refresh);
    }
}
