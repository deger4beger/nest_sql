import { BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { UserRO } from '../dto/user.dto';
import { IdeaEntity } from '../../ideas/entities/idea.entity';

@Entity("user")
export class UserEntity {

	@PrimaryGeneratedColumn("uuid")
	id: string

	@CreateDateColumn()
	created: Date

	@Column({
		type: "text",
		unique: true
	})
	username: string

	@Column("text")
	password: string

	@OneToMany(type => IdeaEntity, idea => idea.author)
	ideas: IdeaEntity[]

	@ManyToMany(type => IdeaEntity)
	@JoinTable()
	bookmarks: IdeaEntity[]

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 10)
	}

	toResponseObject(showToken: boolean = true): UserRO {
		const { id, created, username, token } = this
		const responseObject: any = { id, created, username }
		if (showToken) {
			responseObject.token = token
		}
		if (this.ideas) {
			responseObject.ideas = this.ideas
		}
		if (this.bookmarks) {
			responseObject.bookmarks = this.bookmarks
		}
		return responseObject
	}

	async comparePassword(attempt: string) {
		const compared = await bcrypt.compare(attempt, this.password)
		if (!compared) {
			return Promise.reject()
		}
		return compared
	}

	private get token() {
		const { id, username } = this
		return jwt.sign(
			{
				id,
				username
			},
			process.env.SECRET,
			{
				expiresIn: "1d"
			}
		)
	}

}