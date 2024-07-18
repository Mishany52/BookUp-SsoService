// config/typed-config.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { TypedConfigService } from './typed-config.service';

// @Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            // envFilePath: '.env',
            isGlobal: true,
            load: [configuration],
        }),
    ],
    providers: [TypedConfigService],
    exports: [TypedConfigService],
})
export class TypedConfigModule {}
