import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { UserResolver } from './graphql/user.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
  	controllers: [UserController],
  	providers: [
  		UserService,
  		UserResolver
  	]
})
export class UserModule {}
