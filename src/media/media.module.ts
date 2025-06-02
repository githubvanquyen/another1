import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import {KafkaModule} from "../kafka/kafka.module";
import {MongooseModule} from "@nestjs/mongoose";
import {Media, MediaSchema} from "./schemas/media.schema";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
      MongooseModule.forFeature([{name: Media.name, schema: MediaSchema}]),
      KafkaModule,
      UserModule,
  ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService]
})
export class MediaModule {}
