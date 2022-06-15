import controllers from '../../../controllers';
import dependencies from '../../../config/dependencies';

export const userRoutes = (fastify) => {
  const { userControllers } = controllers;
  const { registrationUserController, loginUserController } =
    userControllers(dependencies);

  fastify
    .route({
      method: 'POST',
      url: '/user/login',
      handler: loginUserController,
    })
    .route({
      method: 'POST',
      url: '/user/registration',
      handler: registrationUserController,
    });
};
