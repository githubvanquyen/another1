import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './email/email.module';
import { KafkaModule } from './kafka/kafka.module';
import { MediaModule } from './media/media.module';
import {join} from "path";
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [
      ConfigModule,
      DatabaseModule,
      UserModule,
      EmailModule,
      KafkaModule,
      MediaModule,
      ServeStaticModule.forRoot({
          rootPath: join(process.cwd(), '..', 'public'),
          serveRoot: '/v1/media/video/',
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
