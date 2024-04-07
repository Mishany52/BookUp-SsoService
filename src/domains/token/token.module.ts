import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenRepositoryModule } from 'src/infrastructure/repository/token/token-repository.module';
import { TokensService } from './token.service';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TokenRepositoryModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.get('jwtAccessSecrete'),
                signOptions: { expiresIn: config.get('jwtAccessExpires') },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [TokensService],
    exports: [TokensService],
})
export class TokensModule {}
