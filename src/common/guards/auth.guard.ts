import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger, UnauthorizedException
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {AppConfigKey, AppConfigType} from "../../config/app.config";
import {UserService} from "../../user/user.service";
import {Types} from "mongoose";
import {JwtPayload} from "jsonwebtoken";

export type JwtAppPayload = JwtPayload & {
    email: string;
    id: Types.ObjectId,
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    private readonly secretKey: string;
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        this.secretKey = this.configService.get<AppConfigType>(AppConfigKey)?.jwtSecretKey || 'token_secret'
    }

    async canActivate(context: ExecutionContext) {
        try {
            const request = context.switchToHttp().getRequest();
            const header = request.headers["authorization"];
            const [type, token] = header.split(' ');
            if(type === 'Bearer' && token) {
                const verify = jwt.verify(token, this.secretKey) as JwtAppPayload || undefined;
                if(verify) {
                    const user = await this.userService.findOne({
                        _id: verify.id,
                        email: verify.email
                    })
                    request.user = user;
                    return true
                }
            }
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            this.logger.error(e.message)
            throw new InternalServerErrorException(e.message)
        }
        throw new ForbiddenException("Unauthorized");
    }
}