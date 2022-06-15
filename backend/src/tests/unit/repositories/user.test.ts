import { repositories } from '../../../hexagon/frameworks/repository/inMemory';
import User from '../../../hexagon/entities/User';
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { usersRepository } = repositories;
describe('Users repository registration', () => {
  test('New user should be returned after registration', async () => {
    const user = new User({
      name: 'Alain',
      email: 'alain@gmail.com',
      password: 'azerty1234',
    });

    const addedUser = await usersRepository.registration(user);
    const match = await bcrypt.compare(
      user.password,
      addedUser.content.lastUserPushed.password,
    );

    expect(addedUser.content.lastUserPushed).toBeDefined();
    expect(addedUser.content.lastUserPushed.personid).toBeDefined();
    expect(addedUser.content.lastUserPushed.name).toBeDefined();
    expect(addedUser.content.lastUserPushed.email).toBeDefined();
    expect(addedUser.content.lastUserPushed.password).toBeDefined();

    expect(addedUser.content.lastUserPushed.name).toBe(user.name);
    expect(addedUser.content.lastUserPushed.email).toBe(user.email);
    expect(match).toBe(true);
  });
});

describe('Users repository login', () => {
  test('Should return user name with good email and password', async () => {
    const user = new User({
      name: 'Pierre',
      email: 'pierre@gmail.com',
      password: 'azerty1234',
    });
    const addedUser = await usersRepository.registration(user);

    const loggedUser = await usersRepository.login(user.email, user.password);

    expect(loggedUser.content.name).toEqual(
      addedUser.content.lastUserPushed.name,
    );
  });

  test("Should return error if email doesn't exist", async () => {
    const loggedUserName = await usersRepository.login(
      'paul@yahoo.com',
      'azerty',
    );
    expect(loggedUserName.status).toBe(404);
    expect(loggedUserName.error).toEqual({
      error: "Email doesn't exist",
      msg: "We doesn't find this email in the database, please register user or use other email",
    });
  });

  test('Should return error if bad password', async () => {
    const user = new User({
      name: 'Paul',
      email: 'paulo@gmail.com',
      password: 'azerty1234',
    });

    const addedUser = await usersRepository.registration(user);
    const loggedUserName = await usersRepository.login(
      addedUser.content.lastUserPushed.email,
      'azerty12345',
    );

    expect(loggedUserName.status).toBe(401);
    expect(loggedUserName.error).toEqual({
      error: 'Bad password',
      msg: 'Your password is not good try again',
    });
  });
});
