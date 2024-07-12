import { IsEmail, IsEnum, IsPhoneNumber, IsString, IsUrl } from 'class-validator';
import { AccountRole } from '../../../../../domains/account/enums/account-role';

export class AccountUpdateDto {
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
