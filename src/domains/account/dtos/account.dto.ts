import { IsEmail, IsEnum, IsPhoneNumber, IsString, IsUrl } from 'class-validator';
import { AccountRole } from '../enums/account-role';

export class AccountDto {
    @IsEmail()
    email: string;
    @IsPhoneNumber('RU')
    phone: string;
    @IsString()
    password: string;
    @IsUrl()
    imgUrl: string;
    @IsEnum(AccountRole)
    role: AccountRole;
}
