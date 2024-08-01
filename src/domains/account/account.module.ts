import { Module } from '@nestjs/common';
import { AccountHttpController } from 'src/api/http/controllers/account/account.http.controller';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/infrastructure/repository/account/account-repository.module';
import { AccountMicroserviceController } from 'src/api/microservice/controllers/account.microservice.controller';
import { MicroserviceLoggerInterceptor } from 'src/common/logger/microservice-logger';
@Module({
    imports: [AccountRepositoryModule],
    controllers: [AccountHttpController, AccountMicroserviceController],
    providers: [AccountService, MicroserviceLoggerInterceptor],
    exports: [AccountService],
})
export class AccountModule {}
