import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_URL || 'localhost:9092'],
      },
      consumer: {
        groupId: "j4f"
      }
    },
  })
  await app.startAllMicroservices();
  const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('API docs for my NestJS app')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
