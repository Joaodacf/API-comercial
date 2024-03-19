const express = require("express");
const usuario = require("./usuarios")



const rotas = express();

rotas.post("/usuario", usuario.cadastrarUsuario)
rotas.post("/login", usuario.loginUsuario)
rotas.get("/usuario", usuario.listarUsuarios)
rotas.put("/usuario/:id", usuario.atualizarUsuario)
rotas.delete("/usuario/:id", usuario.deletarUsuario)

module.exports = rotas;