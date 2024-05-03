const knex = require('knex');

const config = {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '1243',
        database: 'contas',
    },
};

const db = knex(config);

module.exports = db;

