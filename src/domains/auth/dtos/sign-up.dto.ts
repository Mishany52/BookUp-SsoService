import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail, IsPhoneNumber } from 'class-validator';
export class SignUpDto {
    @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
    @IsString({ message: 'Должно быть строкой' })
    @IsEmail({}, { message: 'Некорректный email' })
    readonly email: string;

    @ApiProperty({ example: '+79000000000', description: 'Номер телефона' })
    @IsString({ message: 'Должно быть строкой' })
    @IsPhoneNumber('RU')
    readonly phone: string;

    @ApiProperty({ example: 'Имя', description: 'Иван' })
    @IsString({ message: 'Должно быть строкой' })
    readonly firstName: string;

    @ApiProperty({ example: 'Отчество', description: 'Иванович' })
    @IsString({ message: 'Должно быть строкой' })
    readonly patronymic: string;

    @ApiProperty({ example: 'Фамилия', description: 'Иванов' })
    @IsString({ message: 'Должно быть строкой' })
    readonly lastName: string;

    @ApiProperty({ example: 'password', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
    password: string;
}
