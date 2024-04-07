import { Module } from '@nestjs/common';
import { AccountController } from 'src/api/http/controllers/account.controller';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/infrastructure/repository/account/account-repository.module';
@Module({
    imports: [AccountRepositoryModule],
    controllers: [AccountController],
    providers: [AccountService],
    exports: [AccountService],
})
export class AccountModule {}
