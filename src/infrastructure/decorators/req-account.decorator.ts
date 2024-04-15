import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const reqAccount = createParamDecorator((data: unknown, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest<Request>();
    return request.user;
});
