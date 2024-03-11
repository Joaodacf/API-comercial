const knex = require('../db.js');
const bycript = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhajwt = require("../senhajwt.js")


const cadastrarUsuario = async function (req, res) {
    const { nome, email, senha } = req.body;
    const senhaCriptografada = await bycript.hash(senha, 10)

    try {
        if (!nome) {
            return res.status(400).json({ mensagem: 'O nome é obrigatorio' })
        }
        if (!email) {
            return res.status(400).json({ mensagem: 'O email é obrigatorio' })
        }
        if (!senha) {
            return res.status(400).json({ mensagem: 'A senha é obrigatoria' })
        }

    } catch (error) {

        return res.status(500).json({ mensagem: "erro interno no cadastro" })
    }
    try {
        const novoUsuario = await knex('usuarios').insert({ nome, email, senha })
        console.log(novoUsuario, "novoUsuario")
        return res.status(201).json(novoUsuario.rows[0]);


    } catch (error) {

        return res.status(500).json({ mensagem: "erro interno no cadastro" })
    }

}

const loginUsuario = async function (req, res) {
    const { email, senha } = req.body;
    try {
        if (!email) {
            return res.status(404).json({ mensagem: 'email obrigatorio' })
        }
        if (!senha) {
            return res.status(404).json({ mensagem: ' senha obrigatorio' })
        }
        const novoUsuario = await knex('*').from('usuarios').where('email', email);
        if (novoUsuario.rowcount < 1) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' })
        }
        const senhaValida = await bycript.compare(senha, novoUsuario.rows[0].senha)
        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'senha invalida' })
        }
        const token = jwt.sign({ id: novoUsuario.rows[0].id }, senhajwt, { expiresIn: '1h' })
        const { senha, ...usuario } = novoUsuario.rows[0]
        return res.status(200).json({ usuario, token })
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no login' })
    }


}
const listarUsuarios = async function (req, res) {
    try {

        const usuarios = await knex('usuarios').select('*'); // use the db instance to interact with the database
        console.log(usuarios, "usuarios")

        return res.status(200).json(usuarios);
    } catch (error) {

        return res.status(500).json({ mensagem: 'erro interno no listar' });
    }
}


const atualizarUsuario = async function (req, res) {
    const id = req.usuario.id
    const { nome, email, senha } = req.body
    try {
        const usuario = await knex('usuarios').where('id', id)
        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' })
        }
        const senhaCriptografada = await bycript.hash(senha, 10)
        const usuarioAtualizado = await knex('usuarios').where('id', id).update({ nome, email, senha: senhaCriptografada })
        return res.status(200).json({ mensagem: 'usuario atualizado com sucesso' })
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no att' })
    }
}

const deletarUsuario = async function (req, res) {
    // Check if req.usuario is defined
    console.log(req);
    if (!req.usuario) {
        return res.status(400).json({ mensagem: 'usuario not defined' });
    }

    const id = req.usuario.id;
    try {
        const usuario = await knex('usuarios').where('id', id);
        if (usuario.length === 0) { // Use .length for arrays, not .rowCount
            return res.status(404).json({ mensagem: 'usuario nao encontrado' });
        }
        const usuarioDeletado = await knex('usuarios').where('id', id).delete();
        return res.status(200).json({ mensagem: 'usuario deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no deletar usuario' });
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    listarUsuarios,
    atualizarUsuario,
    deletarUsuario
}