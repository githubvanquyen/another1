import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import config from "./index.config";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [...Object.values(config)],
        }),
    ],
})
export class ConfigModule {}
