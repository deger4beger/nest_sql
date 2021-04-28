import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, UsePipes } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDTO } from './dto/comment.dto'
import { AuthGuard } from '../shared/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { User } from '../user/user.decorator';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get("idea/:id")
    showCommentsByIdea(@Param("id") idea: string) {
        return this.commentsService.showByIdea(idea)
    }

    @Get("user/:id")
    showCommentsByUser(@Param("id") user: string) {
        return this.commentsService.showByUser(user)
    }

    @Get(":id")
    showComment(@Param("id") id: string) {
        return this.commentsService.showOne(id)
    }

    @Post("idea/:id")
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    createComment(
        @Param("id") idea: string,
        @User("id") user: string,
        @Body() data: CommentDTO
    ) {
        return this.commentsService.create(idea, user, data)
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    deleteComment(@Param("id") id: string, @User("id") user: string) {
        return this.commentsService.delete(id, user)
    }

}
