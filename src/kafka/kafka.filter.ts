import {ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import {KafkaContext, KafkaRetriableException} from "@nestjs/microservices";
import {IHeaders} from "@nestjs/microservices/external/kafka.interface";

@Catch()
export class KafkaFilter implements ExceptionFilter {
    private readonly logger = new Logger(KafkaFilter.name);
    constructor(
        private readonly maxRetries: number,
        private readonly skipHandler?: (message: any) => Promise<void>,
    ) {}

    async catch(exception: unknown, host: ArgumentsHost) {
        const kafkaContext = host.switchToRpc().getContext<KafkaContext>();

        if (!kafkaContext || typeof kafkaContext.getMessage !== 'function') {
            console.error('KafkaContext invalid.');
            return;
        }

        const message = kafkaContext.getMessage();
        console.log('messsage filter: ', message)

        const headers: IHeaders = message.headers || {};

        const retryHeader = headers['retryCount'] || headers['retry-count'];

        const currentRetryCount = retryHeader ? Number(retryHeader) : 0;


        console.log('currentRetryCount: ', currentRetryCount)

        if(currentRetryCount >= this.maxRetries) {
            console.warn(
                `Max retries (${
                    this.maxRetries
                }) exceeded for message: ${JSON.stringify(message)}`,
            );

            if(this.skipHandler) {
                try {
                    await this.skipHandler(message)
                } catch (e) {
                    console.error('Error in skipHandler:', e);
                }
            }

            try {
                const consumer = kafkaContext.getConsumer && kafkaContext.getConsumer();

                if(!consumer) {
                    console.error('Consumer instance is not available from KafkaContext.');
                    return
                }

                const topic = kafkaContext.getTopic && kafkaContext.getTopic();
                const partition = kafkaContext.getPartition && kafkaContext.getPartition();

                const offset =  message.offset;


                if (!topic || partition === undefined || offset === undefined) {
                    console.error(
                        'Incomplete Kafka message context for committing offset.',
                    );
                    return
                }
                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(offset) + 1).toString(),
                    }
                ])
            } catch (e) {
                this.logger.error('Failed to commit offset:', e);
            }
            return
        }

        throw exception
    }
}
