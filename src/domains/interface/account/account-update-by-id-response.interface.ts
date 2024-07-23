/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetAccountDto } from 'src/api/http/controllers/dto/account/get-account.dto';

export interface IAccountUpdateByIdResponse {
    status: number;
    message: string;
    data: GetAccountDto | null;
    errors: { [key: string]: any } | null;
}
