import { BadRequestException, NotFoundException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from "typeorm"
import { IdeaEntity } from './entities/idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './dto/idea.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Votes } from '../shared/votes.enum';

@Injectable()
export class IdeasService {
	constructor(
		@InjectRepository(IdeaEntity)
		private ideaRepository: Repository<IdeaEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	){}

	private toResponseObject(idea: IdeaEntity): IdeaRO {
		const ro: any = { ...idea, author: idea.author.toResponseObject(false) }
		if (ro.upvotes) {
			ro.upvotes = idea.upvotes.length
		}
		if (ro.downvotes) {
			ro.downvotes = idea.downvotes.length
		}
		return ro
	}

	private ensureOwnership(idea: IdeaEntity, userId: string) {
		if (idea.author.id !== userId) {
			throw new UnauthorizedException("Incorrect user")
		}
	}

	private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
		const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP
		if (
			idea[opposite].some(voter => voter.id === user.id) ||
			idea[vote].some(voter => voter.id === user.id)
		) {
			idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id)
			idea[vote] = idea[vote].filter(voter => voter.id !== user.id)
			await this.ideaRepository.save(idea)
		} else if (idea[vote].every(voter => voter.id !== user.id)) {
			idea[vote].push(user)
			await this.ideaRepository.save(idea)
		} else {
			throw new BadRequestException("Unable to cast vote")
		}
		return idea
	}

	async getAll(page: number = 1): Promise<IdeaRO[]> {
		try {
			const ideas = await this.ideaRepository.find({
				relations: [
					"author",
					"upvotes",
					"downvotes",
					"comments"
				],
				take: 3,
				skip: 3 * (page - 1)
			})
			return ideas.map(idea => this.toResponseObject(idea))
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async getOne(id: string): Promise<IdeaRO> {
		try {
			const idea = await this.ideaRepository.findOne({ where: { id }, relations: [
				"author",
				"upvotes",
				"downvotes",
				"comments"
			]})
			return this.toResponseObject(idea)
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async create(userId: string, data: IdeaDTO): Promise<IdeaRO> {
		try {
			const user = await this.userRepository.findOne({ where: { id: userId } })
			const idea = await this.ideaRepository.create({ ...data, author: user })
			await this.ideaRepository.save(idea)
			return this.toResponseObject(idea)
		} catch (err) {
			throw new NotFoundException("Not found")
		}

	}

	async update(id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
		try {
			let idea = await this.ideaRepository.findOne({ where: { id }, relations: ["author"]})
			this.ensureOwnership(idea, userId)
			await this.ideaRepository.update({ id }, data)
			idea = await this.ideaRepository.findOne({ where: { id }, relations: ["author", "comments"]})
			return this.toResponseObject(idea)
		} catch (err) {
			throw new NotFoundException("Not found")
		}

	}

	async delete(id: string, userId: string) {
		try {
			let idea = await this.ideaRepository.findOne({ where: { id }, relations: ["author"]})
			this.ensureOwnership(idea, userId)
			await this.ideaRepository.delete({ id })
			return { deleted: true }
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async upvote(id: string, userId: string) {
		try {
			let idea = await this.ideaRepository.findOne({where: {id}, relations: [
				"author",
				"upvotes",
				"downvotes",
				"comments"]})
			const user = await this.userRepository.findOne({where: {id: userId}})

			idea = await this.vote(idea, user, Votes.UP)
			return this.toResponseObject(idea)
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async downvote(id: string, userId: string) {
		try {
			let idea = await this.ideaRepository.findOne({where: {id}, relations: [
				"author",
				"upvotes",
				"downvotes",
				"comments"]})
			const user = await this.userRepository.findOne({where: {id: userId}})

			idea = await this.vote(idea, user, Votes.DOWN)
			return this.toResponseObject(idea)
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async bookmark(id: string, userId: string) {
		try {
			const idea = await this.ideaRepository.findOne( {where: {id} })
			const user = await this.userRepository.findOne( {where: {id: userId},
				relations: ["bookmarks"] })
			if (!user.bookmarks.some(bookmark => bookmark.id === idea.id)) {
				user.bookmarks.push(idea)
				await this.userRepository.save(user)
			} else {
				throw new BadRequestException("Idea already bookmarked")
			}
			return user.toResponseObject(false)
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}

	async unbookmark(id: string, userId: string) {
		try {
			const idea = await this.ideaRepository.findOne( {where: {id} })
			const user = await this.userRepository.findOne( {where: {id: userId},
				relations: ["bookmarks"] })
			if (user.bookmarks.some(bookmark => bookmark.id === idea.id)) {
				user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id)
				await this.userRepository.save(user)
			} else {
				throw new BadRequestException("Idea is not bookmarked yet")
			}
			return user.toResponseObject(false)
		} catch (err) {
			throw new NotFoundException("Not found")
		}
	}
}
