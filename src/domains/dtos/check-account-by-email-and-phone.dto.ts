import { GetAccountDto } from 'src/api/http/controllers/dto/account/get-account.dto';

export class CheckAccountDto {
    account: GetAccountDto | null;
    emailTaken: boolean;
    phoneTaken: boolean;
    constructor(isEmail: boolean, isPhone: boolean, account: GetAccountDto) {
        this.account = account;
        this.emailTaken = isEmail;
        this.phoneTaken = isPhone;
    }
}
