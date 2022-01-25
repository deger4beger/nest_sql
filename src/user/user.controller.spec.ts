import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ValidationPipe } from '../shared/validation.pipe';

describe('UserController', () => {

    let controller: UserController;
    const mockService = {
        register: jest.fn((dto) => {
            return {
                id: Date.now(),
                ...dto
            }
        }),
        login: jest.fn((dto) => dto),
        showAll: jest.fn((page) => page)
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        }).overrideProvider(UserService).useValue(mockService).compile()

        controller = moduleRef.get<UserController>(UserController)

    })

    it("controller should be defined", () => {
        expect(controller).toBeDefined()
    })

    it("should register new user", () => {
        const dto = {
            username: "name",
            password: "morpex"
        }
        expect(controller.register(dto)).toEqual({
            ...dto,
            id: expect.any(Number)
        })

        expect(mockService.register).toHaveBeenCalledWith(dto)
        expect(mockService.register).toHaveBeenCalledTimes(1)

    })

    it("should login user", () => {
        const dto = {
            username: "name",
            password: "morpex"
        }

        expect(controller.login(dto)).toEqual(dto)

        expect(mockService.login).toHaveBeenCalledWith(dto)
        expect(mockService.login).toHaveBeenCalledTimes(1)

    })

    it("should get all users", () => {

        const page = 3

        expect(controller.showAllUsers(page)).toEqual(page)

        expect(mockService.showAll).toHaveBeenCalledWith(page)
        expect(mockService.showAll).toHaveBeenCalledTimes(1)

    })

})