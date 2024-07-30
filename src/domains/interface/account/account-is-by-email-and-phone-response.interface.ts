/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckAccountDto } from 'src/domains/dtos/check-account-by-email-and-phone.dto';

export interface IAccountCheckByEmailPhoneResponse {
    status: number;
    message: string;
    data: CheckAccountDto;
    errors: { [key: string]: any } | null;
}
