import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const reqPayloadAndRefresh = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const payload = request.user;
        return payload;
    },
);
