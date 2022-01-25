import { IsNotEmpty } from 'class-validator';
import { IdeaEntity } from '../../ideas/entities/idea.entity';

export class UserDTO {

	@IsNotEmpty()
	username: string

	@IsNotEmpty()
	password: string

}

export class UserRO {
	id: string
	username: string
	created: Date
	token?: string
}