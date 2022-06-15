import Response from '../../frameworks/common/response';

export default (dependencies) => {
  const {
    useCases: {
      userUseCases: { loginUserUseCase },
    },
  } = dependencies;
  const loginUser = async (request, response) => {
    try {
      const { body = {} } = request;

      const { email, password } = body;

      const response = await loginUserUseCase(dependencies).execute({
        email,
        password,
      });
      return response;
    } catch (err) {
      return new Response({ status: err.status || 500, error: err });
    }
  };

  return loginUser;
};
