import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn } from "typeorm"
import { UserEntity } from '../../user/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity("idea")
export class IdeaEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn()
	created: Date

	@UpdateDateColumn()
	updated: Date

	@Column("text")
	idea: string

	@Column("text")
	description: string

	@ManyToOne(type => UserEntity, author => author.ideas)
	author: UserEntity

	@ManyToMany(type => UserEntity)
	@JoinTable()
	upvotes: UserEntity[]

	@ManyToMany(type => UserEntity)
	@JoinTable()
	downvotes: UserEntity[]

	@OneToMany(type => CommentEntity, comment => comment.idea)
	comments: CommentEntity[]
}