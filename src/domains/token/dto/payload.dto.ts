import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { AccountRole } from 'src/domains/account/enums/account-role';
import { UUID } from 'crypto';
import { IAccount } from 'src/domains/interface/account/account.interface';

export class PayloadDto {
    @ApiProperty({ example: 'a71d077e-043a-4c80-9e6f-db6385e21ac5' })
    @IsUUID()
    readonly accountId: UUID;

    @ApiProperty({ enum: AccountRole })
    @IsEnum(AccountRole)
    readonly role: AccountRole;

    constructor(model: IAccount) {
        this.accountId = model.id;
        this.role = model.role;
    }
}
