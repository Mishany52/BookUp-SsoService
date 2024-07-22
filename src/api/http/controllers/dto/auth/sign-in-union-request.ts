import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SingInDtoByPhone } from './sing-in-by-phone.dto';
import { SingInDtoByEmail } from './sign-on-by-email.dto';
import { IsNotEmptyObject } from 'class-validator';
@ApiExtraModels(SingInDtoByEmail, SingInDtoByPhone)
export class RequestSingInUnion {
    @ApiProperty({
        oneOf: [
            { $ref: getSchemaPath(SingInDtoByEmail) },
            { $ref: getSchemaPath(SingInDtoByPhone) },
        ],
    })
    @IsNotEmptyObject()
    body: SingInDtoByEmail | SingInDtoByPhone;
}
