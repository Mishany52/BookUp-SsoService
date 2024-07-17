import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { JwtSignDto } from 'src/domains/token/dto/jwt-sign.dto';
export class AccessTokenDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
    @IsJWT()
    readonly accessToken: string;
    constructor(tokens: JwtSignDto) {
        this.accessToken = tokens.accessToken;
    }
}
