import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeaDTO } from './dto/idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AtLeastOne } from '../shared/types';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';

@Controller('ideas')
export class IdeasController {
    constructor(private readonly ideasService: IdeasService) {}

    @Get()
    getAllIdeas(@Query("page") page: number) {
        return this.ideasService.getAll(page)
    }

    @Get(":id")
    getOneIdea(@Param("id") id: string) {
        return this.ideasService.getOne(id)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    createIdea(@User("id") user: string, @Body() data: IdeaDTO) {
        return this.ideasService.create(user, data)
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    updateIdea(@Param("id") id: string, @User("id") user: string, @Body() data: Partial<IdeaDTO>) {
        return this.ideasService.update(id, user, data)
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    deleteIdea(@Param("id") id: string, @User("id") user: string) {
        return this.ideasService.delete(id, user)
    }

    @Post(":id/upvote")
    @UseGuards(AuthGuard)
    upvoteIdea(@Param("id") id: string, @User("id") user: string) {
        return this.ideasService.upvote(id, user)
    }

    @Post(":id/downvote")
    @UseGuards(AuthGuard)
    downvoteIdea(@Param("id") id: string, @User("id") user: string) {
        return this.ideasService.downvote(id, user)
    }

    @Post(":id/bookmark")
    @UseGuards(AuthGuard)
    bookmarkIdea(@Param("id") id: string, @User("id") user) {
        return this.ideasService.bookmark(id, user)
    }

    @Delete(":id/bookmark")
    @UseGuards(AuthGuard)
    unbookmarkIdea(@Param("id") id: string, @User("id") user) {
        return this.ideasService.unbookmark(id, user)
    }

}
