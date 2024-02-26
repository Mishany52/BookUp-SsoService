import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './api/http/account/account.module';
import { Account } from './api/http/account/entities/account.entity';
import { Profile } from './api/http/account/entities/profile.entity';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: 5432,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            synchronize: true,
            autoLoadEntities: true,
            entities: [Account, Profile]
        }),
        AccountModule,
    ],
})
export class AppModule {}
