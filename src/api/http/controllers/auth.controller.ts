import { Body, Controller, Post, UseGuards, Res, Get, Req } from '@nestjs/common';
import { SignUpDto } from '../../../domains/auth/dtos/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/domains/auth/auth.service';
import { PayloadDto } from 'src/domains/token/dto/payload.dto';
import { Response as ResponseType, Request as RequestType } from 'express';
import { SingInDtoByEmail } from 'src/domains/auth/dtos/sign-on-by-email.dto';
import { SingInDtoByPhone } from 'src/domains/auth/dtos/sing-in-by-phone.dto';
import { AccessTokenDto } from 'src/domains/auth/dtos/access-token.dto';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { JwtAuthGuard } from 'src/guards/jwt-authenticated.guard';
import { EXPIRE_TIME } from 'src/infrastructure/constants/auth/jwt.constants';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 201 })
    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        return await this._authService.singUp(signUpDto);
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
