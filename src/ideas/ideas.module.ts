import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { IdeaEntity } from './entities/idea.entity';
import { APP_PIPE } from '@nestjs/core';
import { UserEntity } from '../user/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
  	controllers: [IdeasController],
  	providers: [
  		IdeasService
  	]
})
export class IdeasModule {}
