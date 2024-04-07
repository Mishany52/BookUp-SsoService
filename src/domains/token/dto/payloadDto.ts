import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { Account } from '../../../infrastructure/types/account';

export class PayloadDto {
    @ApiProperty({ example: 'a71d077e-043a-4c80-9e6f-db6385e21ac5', description: 'uuid' })
    @IsString({ message: 'Должно быть строкой uuid' })
    readonly accountId: string;

    @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
    @IsEnum({
        message:
            'Должно быть одной из ролью("administrator", "owner", "employee", "manager", "customer"',
    })
    readonly role: AccountRole;

    constructor(model: Account) {
        this.accountId = model.id;
        this.role = model.role;
    }
}
