/* eslint-disable @typescript-eslint/no-shadow */
import { Kafka, Consumer as KafkaConsumer } from 'kafkajs';

interface IConsumer {
  groupId: string
}

interface IConsume {
  topic: string,
  fromBeginning: boolean
}

export default class Consumer {
  private consumer: KafkaConsumer

  constructor({ groupId }: IConsumer) {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId });
  }

  public async consume({ topic, fromBeginning }: IConsume) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning });

    console.log(`consuming ${topic}`);

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: String(message.value),
          partition,
          topic,
        });
      },
    });
  }
}
