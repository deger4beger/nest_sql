import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IdeaEntity } from '../../ideas/entities/idea.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity("comment")
export class CommentEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn()
	created: Date

	@Column("text")
	comment: string

	@ManyToOne(type => IdeaEntity, idea => idea.comments, {onDelete: "CASCADE"})
	idea: IdeaEntity

	@ManyToOne(type => UserEntity)
	@JoinTable()
	author: UserEntity
}
