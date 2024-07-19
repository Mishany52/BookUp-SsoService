import { Module } from '@nestjs/common';
import { AccountHttpController } from 'src/api/http/controllers/account/account.http.controller';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/infrastructure/repository/account/account-repository.module';
import { AccountMicroserviceController } from 'src/api/http/controllers/account/account.microservice.controller';
@Module({
    imports: [AccountRepositoryModule],
    controllers: [AccountHttpController, AccountMicroserviceController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {}
