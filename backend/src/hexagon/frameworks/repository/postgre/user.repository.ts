import inMemoryDB from '../../database/inMemory';
import UserQuery from '../../../models/user.interface';
const { users } = inMemoryDB;
import Response from '../../common/response';
import ResponseError from '../../common/responseError';
import { pg } from '../../../config/bdd';
const bcrypt = require('bcrypt');
const saltRounds = 10;
import { getRandomInt } from '../../common/utils';

export default {
  registration: async (user: UserQuery): Promise<Response> => {
    if (!user.personid) {
      user.personid = getRandomInt(1, 1000);
    }

    const existingUserName = await pg('persons')
      .select('*')
      .where('name', user.name);

    if (existingUserName.length > 0) {
      return new Response({
        status: 500,
        error: new ResponseError({
          error: 'Name already exist',
          msg: 'We already find this name in the database, please use other data.',
        }),
      });
    }

    const existingUserEmail = await pg('persons')
      .select('*')
      .where('email', user.email);

    if (existingUserEmail.length > 0) {
      return new Response({
        status: 500,
        error: new ResponseError({
          error: 'Email already exist',
          msg: 'We already find this email in the database, please use other data.',
        }),
      });
    }

    const hash = await bcrypt.hash(user.password, saltRounds);

    return pg('persons')
      .insert(
        {
          ...user,
          password: hash,
        },
        {
          personid: 'persons.personid',
          name: 'persons.name',
          email: 'persons.email',
          password: 'persons.password',
          city: 'persons.city',
        },
      )
      .then((res) => {
        return new Response({
          status: 200,
          content: { lastUserPushed: res[0] },
        });
      })
      .catch((err) => {
        return new Response({
          status: 500,
          error: err,
        });
      });
  },
  login: async (email: string, password: string): Promise<Response> => {
    const user = await pg('persons').select('*').where('email', email);

    if (user.length === 0) {
      return new Response({
        status: 404,
        error: new ResponseError({
          error: "Email doesn't exist",
          msg: "We doesn't find this email in the database, please register user or use other email",
        }),
      });
    }

    const same = await bcrypt.compare(password, user[0].password);

    if (!same) {
      return new Response({
        status: 401,
        error: new ResponseError({
          error: 'Bad password',
          msg: 'Your password is not good try again',
        }),
      });
    }

    return new Response({ status: 200, content: { name: user[0].name } });
  },
};
