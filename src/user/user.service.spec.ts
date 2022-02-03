import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

describe('UserService', () => {

    let service: UserService;

    const mockRepository = {
        findOne: jest.fn((options) => {
            return Promise.resolve({
                comparePassword: jest.fn((password) => Promise.resolve(password)),
                toResponseObject: jest.fn(() => ({
                    id: Date.now(),
                    token: Date.now(),
                    username: "username",
                    password: "password"
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

        const userData = {
            username: "username",
            password: "password"
        }

        const response = await service.login(userData)

        expect(response).toEqual({
            id: expect.any(Number),
            token: expect.any(Number),
            ...userData
        })

    })

})