import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { JwtSign } from 'src/domains/token/dto/tokensDto';
export class AccessTokenDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
    @IsJWT()
    readonly accessToken: string;
    constructor(tokens: JwtSign) {
        this.accessToken = tokens.accessToken;
    }
}
