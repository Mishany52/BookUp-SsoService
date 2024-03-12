import { Module } from '@nestjs/common';

import { UserEntity } from './user.entity';
import { userRepoProvider } from './UserPersistenceProvider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../Profile/profile.entity';
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Profile])],
    providers: [userRepoProvider],
    exports: [userRepoProvider],
})
export class UserRepositoryModule {}
