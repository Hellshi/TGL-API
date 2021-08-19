/* eslint-disable import/prefer-default-export */
import * as express from 'express';

import { router } from './routes';

const app = express();

app.use(express.json());

app.use(router);

export { app };
