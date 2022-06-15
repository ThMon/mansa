import { useCases } from '../../../hexagon/useCases';
import { repositories } from '../../../hexagon/frameworks/repository/inMemory';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { usersRepository } = repositories;

const {
  userUseCases: { registrationUserUseCase, loginUserUseCase },
} = useCases;

describe('User use cases registration', () => {
  const dependencies = {
    usersRepository: usersRepository,
  };

  const registrationUser = registrationUserUseCase(dependencies).execute;

  const loginUser = loginUserUseCase(dependencies).execute;

  test('New user should be returned after registration', async () => {
    const testUserData = {
      name: 'Jacques',
      email: 'jacquot@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);
    const match = await bcrypt.compare(
      testUserData.password,
      addedUser.content.lastUserPushed.password,
    );

    expect(addedUser.content.lastUserPushed).toBeDefined();
    expect(addedUser.content.lastUserPushed.personid).toBeDefined();
    expect(addedUser.content.lastUserPushed.name).toBeDefined();
    expect(addedUser.content.lastUserPushed.email).toBeDefined();
    expect(addedUser.content.lastUserPushed.password).toBeDefined();

    expect(addedUser.content.lastUserPushed.name).toBe(testUserData.name);
    expect(addedUser.content.lastUserPushed.email).toBe(testUserData.email);
    expect(match).toBe(true);
    expect(addedUser.content.lastUserPushed.city).toBe(testUserData.city);
  });

  test('Name sould be alphanumeric', async () => {
    const testUserData = {
      name: 'J@cques',
      email: 'j@cquot@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);

    expect(addedUser.status).toBe(401);
    expect(addedUser.error).toEqual({
      error: 'Wrong caracter name',
      msg: 'You have to use only alphanumeric caracters',
    });
  });

  test('Name sould be between 4 and 50 caracters', async () => {
    const testUserData = {
      name: 'j',
      email: 'j@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);
    expect(addedUser.status).toBe(401);
    expect(addedUser.error).toEqual({
      error: 'Wrong size name',
      msg: 'You have to create a name between 4 and 150',
    });
  });

  test('Name sould be accepted', async () => {
    const testUserData = {
      name: 'Gege75',
      email: 'gege@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);
    expect(addedUser.status).toBe(200);
  });

  test('New user must have correct email', async () => {
    const testUserData = {
      name: 'Gege',
      email: 'gege.gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);
    expect(addedUser.status).toBe(401);
    expect(addedUser.error).toEqual({
      error: 'Wrong email',
      msg: 'You have to use a correct email address',
    });

    const testUserData2 = {
      name: 'Cindy',
      email: 'cindy@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };

    const addedUser2 = await registrationUser(testUserData2);
    expect(addedUser2.status).toBe(200);
  });

  test('New user must have alphanumeric and good length password ', async () => {
    const testUserData = {
      name: 'John',
      email: 'john@gmail.com',
      password: '@zerty1234',
      city: 'Paris',
    };

    const addedUser = await registrationUser(testUserData);

    expect(addedUser.status).toBe(401);
    expect(addedUser.error).toEqual({
      error: 'Wrong caracter password',
      msg: 'You have to use only alphanumeric caracters',
    });

    const testUserData2 = {
      name: 'John',
      email: 'john@gmail.com',
      password: 'a1',
      city: 'Paris',
    };

    const addedUser2 = await registrationUser(testUserData2);

    expect(addedUser2.status).toBe(401);
    expect(addedUser2.error).toEqual({
      error: 'Wrong caracter password',
      msg: 'You have to create password between 8 and 255 caracters',
    });
  });

  test('New user have to have differente name and email', async () => {
    const testUserData = {
      name: 'Yohan',
      email: 'yoyo@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };
    const addedUser = await registrationUser(testUserData);
    expect(addedUser.status).toBe(200);

    const testUserData2 = {
      name: 'Yohan',
      email: 'yoyo34@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };
    const addedUser2 = await registrationUser(testUserData2);

    expect(addedUser2.status).toBe(500);
    expect(addedUser2.error).toEqual({
      error: 'Name already exist',
      msg: 'We already find this name in the database, please use other data.',
    });

    const testUserData3 = {
      name: 'Yohan23',
      email: 'yoyo@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };
    const addedUser3 = await registrationUser(testUserData3);

    expect(addedUser3.status).toBe(500);
    expect(addedUser3.error).toEqual({
      error: 'Email already exist',
      msg: 'We already find this email in the database, please use other data.',
    });
  });

  describe('Users repository login', () => {
    test('Should return user name with good email and password', async () => {
      const testUserData = {
        name: 'Denis',
        email: 'denis@gmail.com',
        password: 'azerty1234',
        city: 'Paris',
      };
      const addedUser = await registrationUser(testUserData);
      expect(addedUser.status).toBe(200);

      const loggedUser = await loginUser({
        email: testUserData.email,
        password: testUserData.password,
      });

      expect(loggedUser.content.name).toEqual(
        addedUser.content.lastUserPushed.name,
      );
    });

    test("Should return error if email doesn't exist", async () => {
      const testUserData = {
        email: 'bernard@gmail.com',
        password: 'azerty1234',
      };

      const loggedUserName = await loginUser({
        email: testUserData.email,
        password: testUserData.password,
      });
      expect(loggedUserName.status).toBe(404);
      expect(loggedUserName.error).toEqual({
        error: "Email doesn't exist",
        msg: "We doesn't find this email in the database, please register user or use other email",
      });
    });
  });

  test('Should return error if bad password', async () => {
    const testUserData = {
      name: 'Tommy',
      email: 'tommy@gmail.com',
      password: 'azerty1234',
      city: 'Paris',
    };
    const addedUser = await registrationUser(testUserData);
    expect(addedUser.status).toBe(200);

    const loggedUserName = await loginUser({
      email: testUserData.email,
      password: 'azorty1234',
    });

    expect(loggedUserName.status).toBe(401);
    expect(loggedUserName.error).toEqual({
      error: 'Bad password',
      msg: 'Your password is not good try again',
    });
  });
});
