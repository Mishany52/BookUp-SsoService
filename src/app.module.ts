import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AccountModule } from './domains/account/account.module';
import { AuthModule } from './domains/auth/auth.module';
import { configuration } from './config/configuration';
import { TokensModule } from './domains/token/token.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
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
