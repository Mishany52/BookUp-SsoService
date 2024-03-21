import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../../../domains/auth/dtos/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/domains/auth/auth.service';
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
}
