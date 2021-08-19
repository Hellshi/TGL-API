/* eslint-disable @typescript-eslint/naming-convention */
import { Kafka, Producer as KafkaProducer, Message } from 'kafkajs'

interface IProducerProps {
  topic: string
  messages: Message[]
}

export default class Producer {
  private producer: KafkaProducer
  constructor() {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
    })
    this.producer = kafka.producer()
  }

  public async Producer({ topic, messages }: IProducerProps) {
    try {
      await this.producer.connect()
      if (messages.length === 0 || topic.trim().length === 0) {
        return { sucess: false }
      }
      await this.producer.send({
        topic,
        messages,
      })
      await this.producer.disconnect()
      return { sucess: true }
    } catch (err) {
      console.log(err)
      return { sucess: false }
    }
  }
}
