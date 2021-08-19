/* eslint-disable import/prefer-default-export */
import express from 'express';
import Consumer from './kafkaServices/consumer';

const app = express();

app.use(express.json());

const consumer = new Consumer({ groupId: 'email-group' });

consumer.consume({ topic: 'email-handler', fromBeginning: true });

export { app };
