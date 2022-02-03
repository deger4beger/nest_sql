import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

describe('UserService', () => {

    let service: UserService;

    const mockRepository = {
        findOne: jest.fn(() => {
            return Promise.resolve({
                comparePassword: jest.fn((password) => Promise.resolve(password)),
                toResponseObject: jest.fn(() => ({
                    response: true
                }))
            })
        }),

    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserService, {
            	provide: getRepositoryToken(UserEntity),
            	useValue: mockRepository
            }],
        }).compile()

        service = moduleRef.get<UserService>(UserService)

    })

    it("service should be defined", () => {
        expect(service).toBeDefined()
    })

    it("should login user", async () => {

        expect(await service.login({
            username: "username",
            password: "password"
        })).toEqual({
            response: true
        })

    })

})