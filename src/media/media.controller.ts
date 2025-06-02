import {Controller, Get, Logger, Req, UseGuards} from '@nestjs/common';
import {Ctx, KafkaContext, MessagePattern, Payload} from "@nestjs/microservices";
import {KafkaService} from "../kafka/kafka.service";
import {MediaService} from "./media.service";
import * as path from 'path';
import {AuthGuard} from "../common/guards/auth.guard";
import {Request} from "express";
import {UserDocument} from "../user/schemas/user.schema";

@Controller('media')
export class MediaController {
    private readonly logger = new Logger(MediaController.name);
    private readonly MAX_RETRIES = 5;

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly mediaService: MediaService,
    ) {}

    // @UseFilters(new KafkaFilter(5))
    @MessagePattern('upload-video')
    async uploadVideo(@Payload() payload: any, @Ctx() ctx: KafkaContext) {
        const message = ctx.getMessage();
        const headers = message.headers || {};
        const currentRetryCount = Number(headers['retryCount'] || 0);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if(currentRetryCount > this.MAX_RETRIES) {
                const consumer = ctx.getConsumer();
                const topic = ctx.getTopic();
                const partition = ctx.getPartition();
                const offset = ctx.getMessage().offset;

                await consumer.commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);
            } else {
                const filePath = path.join(process.cwd(), '..', 'upload', payload.filename);
                await this.mediaService.uploadVideoFfmpeg(filePath);
            }
        } catch (e) {
            console.error('error: ', e)
            message.headers = { ...message.headers, retryCount: (currentRetryCount + 1).toString() }
            await this.kafkaService.retryMessage(ctx, message)
        }
    }

    @UseGuards(AuthGuard)
    @Get('video')
    async getVideo(@Req() request: Request) {
        const user = request['user'] as unknown as UserDocument;
        const video =  await this.mediaService.findAll({})

        return {
            message: 'OK',
            payload: video,
        }
    }

}
