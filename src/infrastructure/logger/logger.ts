import { Logger } from '@nestjs/common';

export class SSOLogger extends Logger {
    constructor(title?: string) {
        super(title ?? 'SSO_SERVICE');
    }
}
