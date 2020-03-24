import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';
import recipientController from './app/controllers/recipientController';
import fileController from './app/controllers/fileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import SignatureController from './app/controllers/SignatureController';
import PackageController from './app/controllers/PackageController';
import DeliveriesController from './app/controllers/DeliveriesController';
import FinishedController from './app/controllers/FinishedController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// rota de usuário que não precisa de autenticação
routes.post('/users', userController.store);
routes.post('/sessions', sessionController.store);

// Middleware de autenticação
routes.use(authMiddleware);

// Rotas de usuario
routes.put('/users', userController.update);

// Rotas de Recipients
routes.post('/recipients', recipientController.store);
routes.put('/recipients/:id', recipientController.update);

// Rotas para Deliveryman
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.destroy);
routes.get('/deliveryman/:id/deliveries', DeliveriesController.index);
routes.get('/deliveryman/:id/deliveries/finished', FinishedController.index);

// Rotas para Packages
routes.get('/packages', PackageController.index);
routes.post('/packages', PackageController.store);
routes.put('/packages/:id', PackageController.update);
routes.delete('/packages/:id', PackageController.destroy);
routes.put('/packages/:id/start', DeliveriesController.update);
routes.put('/packages/:id/end', FinishedController.update);

// Rotas para Problemas
routes.get('/problems', ProblemController.index);
routes.get('/packages/:id/problems', DeliveryProblemController.index);
routes.post('/packages/:id/problems', DeliveryProblemController.store);
routes.delete('/problems/:id/cancel-delivery', DeliveriesController.delete);

// Rota de upload do avatar
routes.post('/files', upload.single('file'), fileController.store);

// Rota para upload da assinatura
routes.post('/signatures', upload.single('file'), SignatureController.store);

export default routes;
