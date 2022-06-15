import User from '../../entities/User';
import {
  isValidateName,
  isValidateEmail,
  isValidatePassword,
} from '../../frameworks/common/userValidation';
import Response from '../../frameworks/common/response';

export default (dependencies) => {
  const { usersRepository } = dependencies;
  if (!usersRepository) {
    throw new Error('the users repository should be exist in dependencies');
  }

  const execute = ({
    name,
    email,
    password,
    city,
  }: {
    name: string;
    email: string;
    password: string;
    city?: string;
  }) => {
    const user = new User({ name, email, password, city });

    const testName = isValidateName(user.name);

    if (testName !== true) {
      return testName as Response;
    }

    const testEmail = isValidateEmail(user.email);

    if (testEmail !== true) {
      return testEmail as Response;
    }

    const testPassword = isValidatePassword(user.password);

    if (testPassword !== true) {
      return testPassword as Response;
    }

    return usersRepository.registration(user);
  };

  return { execute };
};
