import { Router } from 'express';

import userController from './app/controllers/userController';

const routes = new Router();

// rotas para usuario
routes.post('/users', userController.store);

export default routes;
