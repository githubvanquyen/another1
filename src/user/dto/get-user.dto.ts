import {IsNotEmpty, IsString} from "class-validator";

export class GetUserDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}