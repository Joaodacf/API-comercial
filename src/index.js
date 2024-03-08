const express = require("express");
const rotas = require("./controladores/rotas")
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

const app = express();


app.listen(3000);