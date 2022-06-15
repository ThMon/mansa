import Fastify from 'fastify';
const fastify = Fastify({});
import { pg } from './config/bdd';
const PORT = process.env.PORT;
import { routes } from './frameworks/fastify/routes';

export default function () {
  return {
    start: () => {
      async function insert() {
        console.log('migrating 🚀');
        try {
          await pg.raw(`CREATE TABLE persons (
              PersonID int,
              name varchar(255),
              email varchar(255),
              password varchar(255),
              city varchar(255)
          );`);
        } catch (error) {
          //console.info(error);
        }
      }
      insert();

      fastify.route({
        method: 'GET',
        url: '/healthz',
        handler: async (request, response) => {
          return { status: 200 };
        },
      });

      routes(fastify);

      fastify.listen(PORT, () => {
        console.log(`Starting server on port ${PORT}`);
      });
    },
  };
}

// import { ok } from "assert";
// import Fastify from "fastify";
// const pg = require("knex")({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "password",
//     searchPath: ["knex", "public"],
//   },
// });
// async function insert() {
//   console.log("migrating 🚀");
//   try {
//     await pg.raw(`CREATE TABLE persons (
//     PersonID int,
//     name varchar(255),
//     email varchar(255),
//     password varchar(255),
//     city varchar(255)
// );`);
//   } catch (error) {
//     console.info(error);
//     console.log('test')
//   }
// }
// insert();
// console.log('ok');
// Fastify({})
//   .route({
//     method: "GET",
//     url: "/health",
//     handler: async (request, response) => { return {test: "azerty"}},
//   })
//   .route({
//     method: "POST",
//     url: "/test",
//     handler: async (request, response) => {
//       console.log("request",request.body);
//       const persons = await pg.raw(`SELECT name, email FROM persons`);
//       return {test: "azerty", persons}
//     },
//   })
//   .route({
//     method: "GET",
//     url: "/registrtion",
//     schema: {
//       querystring: {
//         name: { type: "string" },
//         email: { type: "string" },
//         password: { type: "string" },
//       },
//     },
//     handler: async (request, reply) => {
//       ok(
//         (request.query["name"].length > 4 &&
//           request.query["name"].length < 50) ||
//           (request.query["email"].includes("@") &&
//             request.query["email"].length < 256)
//       );
//       pg("persons").insert(request.query).then(reply.send({}));
//     },
//   })
//   .route({
//     method: "GET",
//     url: "/login",
//     schema: {
//       querystring: {
//         email: { type: "string" },
//         password: { type: "string" },
//       },
//       response: {
//         200: {
//           type: "object",
//           properties: {
//             name: { type: "string" },
//           },
//         },
//       },
//     },
//     handler: (request, reply) =>
//       pg("persons")
//         .where({
//           email: request.query["email"],
//           password: request.query["password"],
//         })
//         .first("name")
//         .then((result) => {
//           reply.send(result);
//         }),
//   })
// .listen(3000);
