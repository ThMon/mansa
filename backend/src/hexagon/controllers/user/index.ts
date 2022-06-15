import registrationUserController from './registrationUser.controller';
import loginUserController from './loginUser.controller';

export const userControllers = (dependencies) => ({
  registrationUserController: registrationUserController(dependencies),
  loginUserController: loginUserController(dependencies),
});
