import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';
import { JwtSignDto } from 'src/domains/token/dto/jwt-sign.dto';
export class AccessTokenDto {
    @ApiProperty({
        example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        description: 'jwt токен',
    })
    @IsJWT()
    readonly accessToken: string;
    constructor(tokens: JwtSignDto) {
        this.accessToken = tokens.accessToken;
    }
}
