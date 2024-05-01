import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { Account } from '../../../infrastructure/types/account';

export class PayloadDto {
    @ApiProperty({ example: 'a71d077e-043a-4c80-9e6f-db6385e21ac5', description: 'uuid' })
    @IsUUID()
    readonly accountId: string;

    @ApiProperty()
    @IsEnum(AccountRole)
    readonly role: AccountRole;

    constructor(model: Account) {
        this.accountId = model.id;
        this.role = model.role;
    }
}
