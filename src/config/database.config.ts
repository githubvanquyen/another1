import { ConfigType, registerAs } from "@nestjs/config";
import {MongooseModuleFactoryOptions} from "@nestjs/mongoose";

export const DatabaseConfigKey = 'database';
export const DatabaseConfig = registerAs(DatabaseConfigKey,
    (): MongooseModuleFactoryOptions => ({
    uri: process.env.MONGODB_URI,
}))

export type DatabaseConfigType = ConfigType<typeof DatabaseConfig>