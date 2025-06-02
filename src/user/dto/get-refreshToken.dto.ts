import {IsNotEmpty, IsString} from "class-validator";

export class GetRefreshTokenDto {
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}