import inMemoryDB from '../../database/inMemory';
import UserQuery from '../../../models/user.interface';
const { users } = inMemoryDB;
import Response from '../../common/response';
import ResponseError from '../../common/responseError';
const bcrypt = require('bcrypt');
const saltRounds = 10;
import { getRandomInt } from '../../common/utils';

export default {
  registration: async (user: UserQuery): Promise<Response> => {
    if (!user.personid) {
      user.personid = getRandomInt(1, 1000);
    }

    if (users.findIndex((u) => u.name === user.name) !== -1) {
      return new Response({
        status: 500,
        error: new ResponseError({
          error: 'Name already exist',
          msg: 'We already find this name in the database, please use other data.',
        }),
      });
    }

    if (users.findIndex((u) => u.email === user.email) !== -1) {
      return new Response({
        status: 500,
        error: new ResponseError({
          error: 'Email already exist',
          msg: 'We already find this email in the database, please use other data.',
        }),
      });
    }

    const hash = await bcrypt.hash(user.password, saltRounds);
    users.push({
      ...user,
      password: hash,
    });
    return new Response({
      status: 200,
      content: { lastUserPushed: users[users.length - 1] },
    });
  },
  login: async (email: string, password: string): Promise<Response> => {
    const user = users.find((user) => user.email === email);
    if (!user) {
      return new Response({
        status: 404,
        error: new ResponseError({
          error: "Email doesn't exist",
          msg: "We doesn't find this email in the database, please register user or use other email",
        }),
      });
    }

    const same = await bcrypt.compare(password, user.password);

    if (!same) {
      return new Response({
        status: 401,
        error: new ResponseError({
          error: 'Bad password',
          msg: 'Your password is not good try again',
        }),
      });
    }

    return new Response({ status: 200, content: { name: user.name } });
  },
};
