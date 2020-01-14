const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'smart-brain',
  },
});

/*
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sallyF@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};
*/

module.exports = db;
