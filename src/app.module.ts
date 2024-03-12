import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './domains/user/UserModule';
import { UserEntity } from './Infrastructure/repository/User/user.entity';
import { Profile } from './Infrastructure/repository/Profile/profile.entity';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.development.env`,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            synchronize: true,
            autoLoadEntities: true,
            entities: [UserEntity, Profile],
        }),
        UserModule,
    ],
})
export class AppModule {}
