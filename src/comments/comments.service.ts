import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CommentDTO } from './dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../ideas/entities/idea.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity) private commentRepository: Repository<CommentEntity>,
        @InjectRepository(IdeaEntity) private ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ){}

    private toResponseObject(comment: CommentEntity) {
        const ro: any = comment
        if (comment.author) {
            ro.author = comment.author.toResponseObject(false)
        }
        return ro
    }

    async showByIdea(id: string) {
        try {
            const idea = await this.ideaRepository.findOne({
                where: { id },
                relations: ["comments", "comments.author", "comments.idea"]
            })
            return idea.comments.map(comment => this.toResponseObject(comment))
        } catch (err) {
            throw new NotFoundException("Idea not found")
        }
    }

    async showByUser(id: string) {
        try {
            const comments = await this.commentRepository.find({
                where: { author: { id } },
                relations: ["author", "idea"]
            })
            return comments.map(comment => this.toResponseObject(comment))
        } catch (err) {
            throw new NotFoundException("Comments not found")
        }
    }

    async showOne(id: string) {
        try {
            const comment = await this.commentRepository.findOne({
                where: { id },
                relations: ["author", "idea"]
            })
            return this.toResponseObject(comment)
        } catch (err) {
            throw new NotFoundException("Idea not found")
        }
    }

    async create(ideaId: string, userId: string, data: CommentDTO) {
        try {
            const idea = await this.ideaRepository.findOne({where: { id: ideaId } })
            const user = await this.userRepository.findOne({where: { id: userId } })
            const comment = await this.commentRepository.create({
                ...data,
                idea,
                author: user
            })

            await this.commentRepository.save(comment)
            return this.toResponseObject(comment)
        } catch (err) {
            throw new BadRequestException("Cannot create the comment")
        }
    }


    async delete(id: string, userId: string) {
        try {
            const comment = await this.commentRepository.findOne({
                where: { id },
                relations: ["author", "idea"]
            })
            if (comment.author.id !== userId) {
                throw new UnauthorizedException("Not enough permissions")
            }
            await this.commentRepository.remove(comment)
            return {
                deleted: true
            }
        } catch (err) {
            throw new BadRequestException("Cannot delete the comment")
        }
    }

}
