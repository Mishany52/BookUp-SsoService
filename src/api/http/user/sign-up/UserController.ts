import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from '../../dto/sign-up.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/domains/user/User';
import { UserService } from '../../../../domains/user/UserService';

@ApiTags('Аккаунты')
@Controller('User')
export class UserController {
    constructor(private readonly _userService: UserService) {}
    @ApiOperation({ summary: 'Создание аккаунта' })
    @ApiResponse({ status: 200 })
    @Post('/signUp')
    signUp(@Body() userDto: SignUpDto): Promise<User> {
        console.log(userDto);
        return this._userService.create(userDto);
    }
}
