import { Router } from 'express';

const router = Router();

router.post('/user', (request, respose) => respose.status(200).send('Hey there'));

export { router };