import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { Module } from '@nestjs/common';
import { tokenRepoProvider } from './token-persistence.provider';

@Module({
    imports: [TypeOrmModule.forFeature([TokenEntity])],
    providers: [tokenRepoProvider],
    exports: [tokenRepoProvider],
})
export class TokenRepositoryModule {}
