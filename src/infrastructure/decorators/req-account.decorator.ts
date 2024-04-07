import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const reqAccount = createParamDecorator((data: unknown, context: ExecutionContext) => {
    // if (context.getType<GqlContextType>() === 'graphql') {
    //     const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();
    //     request = ctx.req;
    // } else {
    // }
    const request: Request = context.switchToHttp().getRequest<Request>();
    return request.user;
});
