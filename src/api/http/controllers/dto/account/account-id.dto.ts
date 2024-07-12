import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class AccountIdDto {
    @ApiProperty()
    accountId: UUID;
}
