/* eslint-disable @typescript-eslint/no-explicit-any */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class MicroserviceLoggerInterceptor implements NestInterceptor {
    private readonly _logger: Logger = new Logger('MICROSERVICE');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const reqRpc = context.switchToRpc().getContext();

        const cmd = JSON.parse(reqRpc.args[1]).cmd;
        const data = context.switchToRpc().getData();
        this._logger.log(`CMD: ${cmd}, DATA: ${JSON.stringify(data)}`);
        const now = Date.now();
        return next.handle().pipe(
            map((data) => {
                if (data.status > 100 && data.status < 400) {
                    this._logger.log(`status: ${data.status} CMD: ${cmd} ${Date.now() - now}ms`);
                } else {
                    this._logger.error(`CMD ${cmd} ${JSON.stringify(data)} ${Date.now() - now}ms`);
                }
                return data;
            }),
        );
    }
}
