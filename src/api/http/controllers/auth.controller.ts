import { Body, Controller, Post, UseGuards, Res, Get, Req } from '@nestjs/common';
import { SignUpDto } from '../../../domains/auth/dtos/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/domains/auth/auth.service';
import { LocalLoginGuard } from 'src/guards/local-login.guard';
import { reqAccount } from 'src/infrastructure/decorators/req-account.decorator';
// import { SingInDtoByPhone } from 'src/domains/auth/dtos/sing-inByPhone.dto';
// import { SingInDtoByEmail } from 'src/domains/auth/dtos/sign-onByEmail.dto';
import { PayloadDto } from 'src/domains/token/dto/payloadDto';
import { JwtSign } from 'src/domains/token/dto/tokensDto';
import { Response as ResponseType, Request as RequestType } from 'express';
import { SingInDtoByEmail } from 'src/domains/auth/dtos/sign-on-by-email.dto';
import { SingInDtoByPhone } from 'src/domains/auth/dtos/sing-in-by-phone.dto';
import { AccessTokenDto } from 'src/domains/auth/dtos/accessTokenDto';
import { JwtRefreshGuard } from 'src/guards/jwt-refresh.guard';
import { JwtAuthGuard } from 'src/guards/jwt-authenticated.guard';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService) {}

    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 201 })
    @Post('/sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        console.log(signUpDto);
        return await this._authService.singUp(signUpDto);
    }

    @ApiOperation({ summary: 'Вход в аккаунта' })
    @ApiResponse({ status: 201 })
    @Post('session/sign-in')
    @UseGuards(LocalLoginGuard)
    async login(@reqAccount() signInDto: PayloadDto): Promise<JwtSign> {
        const tokens = this._authService.jwtSing(signInDto);
        // res.cookie('access_token', tokens.accessToken, { httpOnly: true });
        return tokens;
    }

    @Post('jwt/sign-in')
    public async jwtLogin(
        @Body() accountDto: SingInDtoByEmail | SingInDtoByPhone,
        @Res({ passthrough: true }) res: ResponseType,
    ): Promise<AccessTokenDto> {
        const tokens = await this._authService.signIn(accountDto);
        res.cookie('refresh_token', tokens.refreshToken, {
            expires: new Date(Date.now() + 3600000),
        });
        const accessDto = new AccessTokenDto(tokens);
        return accessDto;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('jwt/refresh')
    public async refresh(
        @Req() req: RequestType,
        @Res({ passthrough: true }) res: ResponseType,
    ): Promise<string> {
        const refresh: string = req.cookies.refresh_token;

        const tokens = await this._authService.refresh(refresh);

        res.cookie('refresh_token', refresh, {
            expires: new Date(Date.now() + 3600000),
        });
        return tokens.accessToken;
    }

    @UseGuards(JwtAuthGuard)
    @Get('jwt/logout')
    public logout(@Req() req: RequestType): Promise<PayloadDto> {
        const refresh: string = req.cookies.refresh_token;
        return this._authService.logout(refresh);
    }
}
