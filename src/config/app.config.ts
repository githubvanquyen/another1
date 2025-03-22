import {ConfigType, registerAs} from '@nestjs/config'
import * as process from "node:process";

export const AppConfigKey: string = 'app';

export const AppConfig = registerAs(AppConfigKey,  () => ({
    url: process.env.SERVER_URL,
    port: process.env.PORT
}))

export type AppConfigType = ConfigType<typeof AppConfig>