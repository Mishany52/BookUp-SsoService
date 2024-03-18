import { Module } from '@nestjs/common';
import { AccountController } from 'src/api/http/account/sign-up/account.controller';
import { AccountService } from './account.service';
import { AccountRepositoryModule } from 'src/Infrastructure/repository/account/account-repository.module';
@Module({
    imports: [AccountRepositoryModule],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule {}
