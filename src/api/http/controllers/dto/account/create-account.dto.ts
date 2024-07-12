import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
    @ApiProperty({
        uniqueItems: true,
        example: 'test@gmail.com',
    })
    email: string;
    @ApiProperty({
        uniqueItems: true,
        example: '+79000000000',
    })
    phone: string;
    @ApiProperty({
        minLength: 8,
        example: 'testTest',
    })
    password: string;

    @ApiProperty({
        example: 'Иванов Иван Иванович',
    })
    fio: string;
}
