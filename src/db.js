const knex = require('knex');

const config = {
    client: 'pg',
    connection: process.env.DB_URLHOST,
};

const db = knex(config);

module.exports = db;

