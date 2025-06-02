import {Body, Controller, ParseFilePipe, Post, UploadedFile, UseInterceptors, UploadedFiles} from '@nestjs/common';
import {KafkaService} from "./kafka.service";
import {ApiBody, ApiConsumes, ApiProperty} from "@nestjs/swagger";
import {UploadVideoDto} from "./dto/upload-video.dto";
import { Express } from "express";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {IFile} from "@nestjs/common/pipes/file/interfaces";
import {diskStorage} from "multer";
import {join, extname} from 'path'

@Controller('messages')
export class KafkaConsumer {

    constructor(private readonly kafkaService: KafkaService) {}

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    @UseInterceptors(FileInterceptor('file',{
        limits: {
            fileSize: 50 * 1024 * 1024, // 50MB
        },
        storage: diskStorage({
            destination: join(process.cwd(), '..', 'upload'),

            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext.toLowerCase()}`;
                cb(null, filename);
            }
        }),
    }))

    @Post('upload-video')
    async postVideo(@UploadedFile('file') file: Express.Multer.File) {
        console.log('file: ', file);
        this.kafkaService.sendMessage('upload-video', file);
        return {
            status: 'ok',
        }
    }
}
