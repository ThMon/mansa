import UserQuery from '../models/user.interface';

export default class User implements UserQuery {
  name: string;
  email: string;
  password: string;
  city: string;

  constructor({
    name,
    email,
    password,
    city = null,
  }: {
    name: string;
    email: string;
    password: string;
    city?: string;
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.city = city;
  }
}
