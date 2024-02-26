import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Account, Profile])],
    controllers: [AccountController],
    providers:[AccountService]
})
export class AccountModule {}
