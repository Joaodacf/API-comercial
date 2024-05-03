const express = require("express");
const usuario = require("./usuarios");
const { cadastrarProduto, editarProduto, detalharProdutoID, listaProdutos, deletarProduto } = require("./produtos");
const { listagemCategoria } = require("./categoria");
const { cadastrarPedido, listarPedidos } = require("./pedidos");
const { verificacaoToken } = require("../intermediario/intermediario");


const rotas = express();

rotas.get("/", (req, res) => {
    res.send("Bem vindo a API do e-commerce");
});
// rotas usuarios
rotas.post("/usuario", usuario.cadastrarUsuario)
rotas.post("/login", usuario.loginUsuario)
rotas.get("/usuario", usuario.listarUsuarios)
rotas.put("/usuario/:id", usuario.atualizarUsuario)
rotas.delete("/usuario/:id", usuario.deletarUsuario)

// rotas senha 
rotas.post("/usuario/esqueci-senha", usuario.esqueciSenha)
rotas.post("/usuario/redefinir-senha/:token", usuario.redefinirSenha)

// rotas produtos 

rotas.post("/produto", verificacaoToken, cadastrarProduto)
rotas.put('/produto/:id', verificacaoToken, editarProduto)
rotas.get('/produto/:id', detalharProdutoID)
rotas.get('/produto', listaProdutos)
rotas.delete("produto", verificacaoToken, deletarProduto)

// rota categoria 
rotas.get("/categoria", listagemCategoria);

// rota pedidos 
rotas.post("/pedido", cadastrarPedido)
rotas.get("/pedido", listarPedidos)

module.exports = rotas;