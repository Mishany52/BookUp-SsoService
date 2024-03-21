import { Injectable } from '@nestjs/common';
import { Account } from 'src/Infrastructure/types/account';

@Injectable()
export class GetAccountDto {
    email: string;
    role: string;
    constructor(model: Account) {
        this.email = model.email;
        this.role = model.role;
    }
}
