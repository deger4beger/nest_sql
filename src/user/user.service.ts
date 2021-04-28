import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './dto/user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>
	) {}

	async showAll(page: number = 1): Promise<UserRO[]> {
		const users = await this.userRepository.find({
			relations: ["ideas", "bookmarks"],
			skip: 25 * (page - 1),
			take: 25 })
		return users.map(user => user.toResponseObject(false))
	}

	async login(data: UserDTO): Promise<UserRO> {
		try {
			const { username, password } = data
			const user = await this.userRepository.findOne({ where: { username } })
			await user.comparePassword(password)
			return user.toResponseObject()
		} catch (err) {
			throw new BadRequestException("Auth failed")
		}
	}

	async register(data: UserDTO): Promise<UserRO> {
		try {
			const { username } = data
			let user = await this.userRepository.findOne({ where: { username } })
			if (user) {
				throw new Error("User already exists")
			}
			user = await this.userRepository.create(data)
			await this.userRepository.save(user)
			return user.toResponseObject()
		} catch (err) {
			throw new BadRequestException(err)
		}

	}

}
