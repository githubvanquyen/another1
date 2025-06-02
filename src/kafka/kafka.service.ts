import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ClientKafka, KafkaContext} from "@nestjs/microservices";

@Injectable()
export class KafkaService implements OnModuleInit {
    private readonly logger = new Logger(KafkaService.name);
    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaService: ClientKafka) {}

    onModuleInit(): any {
        this.kafkaService.connect().then(() => {
            console.log('Connected to Kafka');
        }).catch((e) => {
            console.log('Failed to connect to Kafka');
        })
    }

    sendMessage(topic: string, message: any) {
        this.kafkaService.emit(topic, message)
    }

    async retryMessage(context: KafkaContext, message: any) {
        const producer = context.getProducer();
        await producer.send({
            topic: context.getTopic(),
            messages: [{ value: JSON.stringify(message.value), headers: message.headers }],
        });
        this.logger.log(`🔄 Retrying message with retryCount=${message.headers.retryCount}`);
    }
}
