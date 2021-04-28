import { IsNotEmpty, IsEmail } from "class-validator"
import { UserRO } from '../../user/dto/user.dto';

export class IdeaDTO {

	@IsNotEmpty()
	readonly idea: string

	@IsNotEmpty()
	readonly description: string

}

export class IdeaRO {
	id?: string
	updated: Date
	created: Date
	idea: string
	description: string
	author: UserRO
	upvotes?: number
	downvotes?: number
}