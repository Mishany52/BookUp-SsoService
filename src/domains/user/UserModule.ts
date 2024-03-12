import { Module } from '@nestjs/common';
import { UserController } from '../../api/http/user/sign-up/UserController';
import { UserService } from './UserService';
import { UserRepositoryModule } from 'src/Infrastructure/repository/User/UserRepositoryModule';
@Module({
    imports: [UserRepositoryModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
