export default (dependencies) => {
  const { usersRepository } = dependencies;
  if (!usersRepository) {
    throw new Error('the users repository should be exist in dependencies');
  }

  const execute = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    return usersRepository.login(email, password);
  };

  return { execute };
};
