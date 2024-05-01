import { Module } from '@nestjs/common';

import { AccountEntity } from './account.entity';
import { accountRepoProvider } from './account-persistence.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
    imports: [TypeOrmModule.forFeature([AccountEntity])],
    providers: [accountRepoProvider],
    exports: [accountRepoProvider],
})
export class AccountRepositoryModule {}
