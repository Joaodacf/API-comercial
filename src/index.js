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
const db = knex(config);
const app = express();

app.use(express.json()); // This line is important to parse JSON request body
app.use(rotas);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports = db;

