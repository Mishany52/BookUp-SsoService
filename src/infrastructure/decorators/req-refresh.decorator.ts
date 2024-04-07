import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const reqPayloadAndRefresh = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // if (context.getType<GqlContextType>() === 'graphql') {
        //     const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();
        //     request = ctx.req;
        // } else {
        // }
        const request: Request = context.switchToHttp().getRequest<Request>();
        const payload = request.user;
        return payload;
    },
);
