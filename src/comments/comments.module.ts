import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from '../ideas/entities/idea.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from './entities/comment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([IdeaEntity,
		UserEntity,
		CommentEntity])],
  	controllers: [CommentsController],
  	providers: [CommentsService]
})
export class CommentsModule {}
