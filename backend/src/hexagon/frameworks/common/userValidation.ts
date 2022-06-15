import ResponseError from './responseError';
import Response from './response';
import { alphanunericRegex, emailRegex } from './constants';

export const isAlphanumeric = (word: string): boolean => {
  return alphanunericRegex.test(word);
};

export const isValidateName = (name: string): boolean | Response => {
  if (name.length < 4 || name.length >= 50) {
    return new Response({
      status: 401,
      error: new ResponseError({
        error: 'Wrong size name',
        msg: 'You have to create a name between 4 and 150',
      }),
    });
  }

  if (!isAlphanumeric(name)) {
    return new Response({
      status: 401,
      error: new ResponseError({
        error: 'Wrong caracter name',
        msg: 'You have to use only alphanumeric caracters',
      }),
    });
  }

  return true;
};

export const isValidateEmail = (email: string): boolean | Response => {
  if (!emailRegex.test(email)) {
    return new Response({
      status: 401,
      error: new ResponseError({
        error: 'Wrong email',
        msg: 'You have to use a correct email address',
      }),
    });
  }

  return true;
};

export const isValidatePassword = (password: string): boolean | Response => {
  if (!isAlphanumeric(password)) {
    return new Response({
      status: 401,
      error: new ResponseError({
        error: 'Wrong caracter password',
        msg: 'You have to use only alphanumeric caracters',
      }),
    });
  }

  if (password.length < 8 || password.length >= 255) {
    return new Response({
      status: 401,
      error: new ResponseError({
        error: 'Wrong caracter password',
        msg: 'You have to create password between 8 and 255 caracters',
      }),
    });
  }

  return true;
};
