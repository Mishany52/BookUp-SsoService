import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthHttpController } from 'src/api/http/controllers/auth/auth.http.controller';
import { AuthService } from './auth.service';
import { AccountRepositoryModule } from 'src/infrastructure/repository/account/account-repository.module';
import { TokensModule } from '../token/token.module';
import { TokenRepositoryModule } from 'src/infrastructure/repository/token/token-repository.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtVerifyStrategy } from './strategies/jwt-refresh.strategy';
import { AuthSerializer } from './auth.serializer';
import { AuthMicroserviceController } from 'src/api/microservice/controllers/auth.microservice.controller';
import { MicroserviceLoggerInterceptor } from 'src/common/logger/microservice-logger';

@Module({
    imports: [AccountModule, AccountRepositoryModule, TokensModule, TokenRepositoryModule],
    controllers: [AuthHttpController, AuthMicroserviceController],
    providers: [
        AuthService,
        AuthSerializer,
        LocalStrategy,
        JwtStrategy,
        JwtVerifyStrategy,
        MicroserviceLoggerInterceptor,
    ],
    exports: [AuthService],
})
export class AuthModule {}
