import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';


describe('UserController', () => {

    let controller: UserController;
    const mockService = {

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

})