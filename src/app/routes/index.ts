import express from 'express';
import { SocialRouter } from '../modules/socialPlatform/socialPlatform.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { TaskRoutes } from '../modules/task/task.route';
import { AuthRoutes } from '../modules/auth/auth.route';


const routes = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/social',
    route: SocialRouter,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/task',
    route: TaskRoutes,
  },

];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));
export default routes;
