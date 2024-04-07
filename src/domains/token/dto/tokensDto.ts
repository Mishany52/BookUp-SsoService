import { IsJWT } from 'class-validator';
export class JwtSign {
    @IsJWT()
    readonly refreshToken: string;
    @IsJWT()
    readonly accessToken: string;
}
