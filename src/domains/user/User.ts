import { UserRole } from './UserRole';
export type User = {
    id: string;
    firstName: string;
    patronymic: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    imgUlr: string;
    role: UserRole;
};
