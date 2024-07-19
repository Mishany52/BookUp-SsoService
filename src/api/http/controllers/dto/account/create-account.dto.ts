import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsUrl } from 'class-validator';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { IAccount } from 'src/domains/interface/account/account.interface';

export class CreateAccountDto implements IAccount {
    @ApiProperty({
        uniqueItems: true,
        example: 'test@gmail.com',
    })
    email: string;
    @ApiProperty({
        uniqueItems: true,
        example: '+79000000000',
    })
    phone: string;
    @ApiProperty({
        minLength: 8,
        example: 'testTest',
    })
    password: string;

    @ApiProperty({
        example: 'Иванов Иван Иванович',
    })
    fio: string;
    @IsUrl()
    @ApiProperty({ example: 'Пока не знаем 2' })
    imgUrl?: string;
    @IsEnum(AccountRole)
    @ApiProperty({ enum: AccountRole, example: AccountRole.client })
    role: AccountRole;
    @IsBoolean()
    @ApiProperty({ example: 'true' })
    active?: boolean;
}
