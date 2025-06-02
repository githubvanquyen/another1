import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UploadVideoDto {
    @ApiProperty({
        type: 'string',
        format: 'binary'
    })
    @IsNotEmpty()
    file: any
}