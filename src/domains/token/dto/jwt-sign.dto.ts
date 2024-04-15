import { IsJWT } from 'class-validator';
export class JwtSignDto {
    @IsJWT()
    readonly refreshToken: string;
    @IsJWT()
    readonly accessToken: string;
}
