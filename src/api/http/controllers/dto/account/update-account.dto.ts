import { PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @IsUUID()
    id: UUID;
}
