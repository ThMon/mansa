import Response from '../../frameworks/common/response';

export default (dependencies) => {
  const {
    useCases: {
      userUseCases: { registrationUserUseCase },
    },
  } = dependencies;
  const registationUser = async (request, response) => {
    try {
      const { body = {} } = request;

      const { name, email, password, city } = body;

      const response = await registrationUserUseCase(dependencies).execute({
        name,
        email,
        password,
        city,
      });
      return response;
    } catch (err) {
      return new Response({ status: err.status || 500, error: err });
    }
  };

  return registationUser;
};
