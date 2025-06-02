import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfigKey, DatabaseConfigType } from "../config/database.config";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => configService.get<DatabaseConfigType>(DatabaseConfigKey) as MongooseModuleFactoryOptions,
        })
    ]
})
export class DatabaseModule {}
