const express = require("express");
const rotas = require("./controladores/rotas")
const db = require('./db.js');

const app = express();

app.use(express.json()); // This line is important to parse JSON request body
app.use(rotas);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

