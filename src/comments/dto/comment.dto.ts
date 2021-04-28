import { IsNotEmpty } from 'class-validator';

export class CommentDTO {

	@IsNotEmpty()
	comment: string

}
