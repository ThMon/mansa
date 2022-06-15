export const pg = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    searchPath: ['knex', 'public'],
  },
});
