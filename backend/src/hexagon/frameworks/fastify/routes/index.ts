import fastify from 'fastify';
import { userRoutes } from './userRoutes';

export const routes = (fastify) => {
  userRoutes(fastify);
};
