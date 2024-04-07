import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsPhoneNumber } from 'class-validator';
export class SingInDtoByPhone {
    @ApiProperty({ example: '+79000000000', description: 'Номер телефона' })
    @IsString({ message: 'Должно быть строкой' })
    @IsPhoneNumber('RU')
    readonly phone: string;

    @ApiProperty({ example: 'password', description: 'Пароль' })
    @IsString({ message: 'Должно быть строкой' })
    @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
    readonly password: string;
}
