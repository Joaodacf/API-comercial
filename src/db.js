const knex = require('knex');
const fs = require('fs');
const config = {
    client: 'pg',
    connection: process.env.DB_URLHOST,
    ssl: { rejectUnauthorized: false },

};

const db = knex(config);

module.exports = db;

