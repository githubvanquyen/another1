import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {MongooseModule} from "@nestjs/mongoose";
import {createUserSchema, User} from "./schemas/user.schema";
import { UserController } from './user.controller';
import { EmailModule } from "../email/email.module";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule,
      MongooseModule.forFeatureAsync([
          {
              name: User.name,
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => createUserSchema(configService),
          }
      ]),
      EmailModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
