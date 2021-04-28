import { Body, Controller, Get, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserDTO } from './dto/user.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("users")
    showAllUsers(@Query("page") page: number) {
        return this.userService.showAll(page)
    }

    @Post("login")
    @UsePipes(ValidationPipe)
    login(@Body() data: UserDTO) {
        return this.userService.login(data)
    }

    @Post("register")
    @UsePipes(ValidationPipe)
    register(@Body() data: UserDTO) {
        return this.userService.register(data)
    }

}
