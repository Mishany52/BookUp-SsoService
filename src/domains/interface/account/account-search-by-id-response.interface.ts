import { IAccount } from './account.interface';

export interface IAccountSearchByIdResponse {
    status: number;
    message: string;
    account: IAccount | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: { [key: string]: any } | null;
}
