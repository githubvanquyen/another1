import {Module} from '@nestjs/common';
import {KafkaService} from './kafka.service';
import {KafkaConsumer} from './kafka.consumer';
import {ClientsModule, Transport} from "@nestjs/microservices";
import * as process from "node:process";

@Module({
  imports: [
    ClientsModule.register({
      clients: [{
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_URL || 'localhost:9092'],
          },
          run: {
            autoCommit: false
          },
          consumer: {
            groupId: "j4f",
            retry: {
              maxRetryTime: 1000,
              multiplier: 2
            }
          }
        },
      }]
    })
  ],
  providers: [KafkaService],
  exports: [KafkaService],
  controllers: [KafkaConsumer],
})
export class KafkaModule {}
