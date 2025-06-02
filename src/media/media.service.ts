import {Injectable} from '@nestjs/common';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs'
import {Media, MediaDocument} from "./schemas/media.schema";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model, ProjectionType, QueryOptions, RootFilterQuery} from "mongoose";
import {MediaType} from "./enums/media.enum";
import * as process from "node:process";
import {ConfigService} from "@nestjs/config";
import {AppConfigKey, AppConfigType} from "../config/app.config";
import {v6 as uuidV6} from 'uuid'

@Injectable()
export class MediaService {
    private readonly SERVER_URL: string | undefined;

    constructor(
        @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
        private readonly configService: ConfigService,
    ) {
        this.SERVER_URL = this.configService.get<AppConfigType>(AppConfigKey)?.url
    }

    async  uploadVideoFfmpeg (filePath: string) {
        const fileOutput = uuidV6() + '_' + new Date().getTime().toString();
        const outputDir = path.join(process.cwd(), '..', 'public', fileOutput)
        const outputPath = path.join(outputDir, 'index.m3u8')

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            ffmpeg(filePath)
                .outputOptions([
                '-profile:v baseline',
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-f hls',
                ])
                .output(outputPath)
                .FPS(60)
                .audioChannels(2)
                .audioCodec('libmp3lame')
                .on('end', async () =>{
                    fs.unlinkSync(filePath);
                    await this.create({
                        type: MediaType.VIDEO,
                        path: `${this.SERVER_URL}/v1/media/video/${fileOutput}/index.m3u8`,
                    })
                    resolve({ message: 'Video processed successfully', outputPath });
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run()
        })
    }

     async create(data: Partial<MediaDocument>) {
        return this.mediaModel.create(data)
    }

    async findAll(filter: RootFilterQuery<MediaDocument>, projection?: ProjectionType<MediaDocument>, query?: QueryOptions<MediaDocument>) {
        return this.mediaModel.find(filter, projection, query)
    }
}
