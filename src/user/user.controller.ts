import {BadRequestException, Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {UserDocument} from "./schemas/user.schema";
import {GetUserDto} from "./dto/get-user.dto";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() body: CreateUserDto) {
        const userExist = await this.userService.findOne({
            email: body.email,
        })

        if(userExist) {
            throw new BadRequestException({
                message: 'User already exists',
            })
        }

        const user: UserDocument = await this.userService.create(body);

        return {
            status: 'ok',
            payload: {
                data: user.getUser()
            }
        }
    }

    @Post('/login')
    async login(@Body() body: GetUserDto) {
        const user: UserDocument | null = await this.userService.findOne({
            email: body.email,
        })

        if(!user) {
            throw new BadRequestException()
        }

        const comparePassword = await user.comparePassword(body.password);

        if(!comparePassword) {
            throw new BadRequestException()
        }

        return {
            status: "ok",
            payload: {
                data: user.getUser()
            }
        }
    }
}
