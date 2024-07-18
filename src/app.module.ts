import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AccountModule } from './domains/account/account.module';
import { AuthModule } from './domains/auth/auth.module';
import { TokensModule } from './domains/token/token.module';
import { TypedConfigModule } from './config/typed-config.module';
@Module({
    imports: [
        TypedConfigModule,
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                ...config.get<TypeOrmModuleAsyncOptions>('db'),
            }),
            inject: [ConfigService],
        }),
        AccountModule,
        AuthModule,
        TokensModule,
    ],
})
export class AppModule {}
