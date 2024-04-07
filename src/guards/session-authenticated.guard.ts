import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private readonly _reflector: Reflector) {}
    public canActivate(context: ExecutionContext): boolean {
        const isPublic = this._reflector.get<boolean>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }

        const request = this.getRequest(context);
        return request.isAuthenticated();
    }

    public getRequest(context: ExecutionContext): Request {
        return context.switchToHttp().getRequest<Request>();
    }
}
