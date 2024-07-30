import { IsEmail, IsPhoneNumber } from 'class-validator';

export class AccountEmailAndPhoneDto {
    @IsEmail()
    email: string;
    @IsPhoneNumber('RU')
    phone: string;
}
