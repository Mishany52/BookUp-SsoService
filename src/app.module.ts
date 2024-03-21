import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './domains/account/account.module';
import { AuthModule } from './domains/auth/auth.module';
import { AccountEntity } from './Infrastructure/repository/account/account.entity';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            synchronize: false,
            autoLoadEntities: true,
            entities: [AccountEntity],
        }),
        AccountModule,
        AuthModule,
    ],
})
export class AppModule {}
