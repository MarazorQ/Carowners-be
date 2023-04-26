import express, { Express, RequestHandler } from 'express';

import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import 'reflect-metadata';
import cors from 'cors';

import { UserController } from './controller/user.controller';
import { VehicleController } from './controller/vehicle.controller';
import { HistoryController } from './controller/history.controller';
import { GlobalErrorHandler } from './middleware/globalErrorHandler';

dotenv.config();

const app: Express = express();

app.use(cors() as RequestHandler);
app.use(bodyParser.json());

useExpressServer(app, {
  routePrefix: '/v1',
  controllers: [UserController, VehicleController, HistoryController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false,
});

export { app };
