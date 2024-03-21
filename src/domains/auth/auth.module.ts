import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthController } from 'src/api/http/Controllers/auth.controller';
import { AccountService } from '../account/account.service';
import { AuthService } from './auth.service';
import { AccountRepositoryModule } from 'src/Infrastructure/repository/account/account-repository.module';

@Module({
    imports: [AccountModule, AccountRepositoryModule],
    controllers: [AuthController],
    providers: [AuthService, AccountService],
})
export class AuthModule {}
