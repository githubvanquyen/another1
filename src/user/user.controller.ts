import {BadRequestException, Body, Controller, Post} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {UserDocument} from "./schemas/user.schema";
import {GetUserDto} from "./dto/get-user.dto";
import {EmailService} from "../email/email.service";
import {GetRefreshTokenDto} from "./dto/get-refreshToken.dto";
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";
import {AppConfigKey, AppConfigType} from "../config/app.config";
import {JwtPayload} from "jsonwebtoken";
import {JwtAppPayload} from "../common/guards/auth.guard";

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

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

        if(user) {
            this.emailService.send(
                "" +
                "",
                body.email,
                "Account has been created. Welcome to J4F ^^",
                "Chúc em yêu buổi tối tốt lành nhé chúp pa chúp <3"
            ).catch((e) => {
                console.log('Mailgun.send', e)
            })
        }

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
    @Post('/refresh-token')
    async refreshToken(@Body() body: GetRefreshTokenDto) {
        const refreshToken = body.refreshToken;
        const jwtSecretKey = this.configService.get<AppConfigType>(AppConfigKey)?.jwtSecretKey || ""
        try {
            const verifyRefreshToken = jwt.verify(refreshToken, jwtSecretKey) as JwtAppPayload
            if(verifyRefreshToken) {
                const user = await this.userService.findOne({
                    _id: verifyRefreshToken.id,
                })
                if(user) {
                    return {
                        status: "ok",
                        accessToken: user.getUser().accessToken,
                    }
                }
            }
        } catch (e) {
            throw new BadRequestException()
        }
    }
}
