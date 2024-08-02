/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
    private readonly _logger: Logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url, body } = req;
        this._logger.log(`Method: ${method}, URL: ${url}, BODY: ${JSON.stringify(body)}`);
        const now = Date.now();
        return next.handle().pipe(
            map((data) => {
                if (data.status > 100 && data.status < 400) {
                    this._logger.log(`${method} ${url} ${Date.now() - now}ms`);
                } else {
                    this._logger.error(`${method} ${url} ${Date.now() - now}ms`);
                }
                return data;
            }),
        );
    }
}
