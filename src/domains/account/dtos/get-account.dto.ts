import { Injectable } from '@nestjs/common';
import { Account } from 'src/infrastructure/types/account';

@Injectable()
export class GetAccountDto {
    email: string;
    role: string;
    constructor(model: Account) {
        this.email = model.email;
        this.role = model.role;
    }
}
