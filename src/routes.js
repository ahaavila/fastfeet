import { Router } from 'express';

import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';
import recipientController from './app/controllers/recipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', userController.store);
routes.post('/sessions', sessionController.store);

routes.use(authMiddleware);

routes.put('/users', userController.update);
routes.post('/recipients', recipientController.store);
routes.put('/recipients/:id', recipientController.update);

export default routes;
