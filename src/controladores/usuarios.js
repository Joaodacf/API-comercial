const knex = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const senhajwt = require("../senhajwt.js");



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

        return res.status(201).json(novoUsuario.rows[0]).json({ mensagem: "usuario cadastrado com sucesso" });


    } catch (error) {

        return res.status(500).json({ mensagem: "erro interno no cadastro" })
    }

}

const loginUsuario = async function (req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'email e senha são obrigatórios' });
    }
    try {
        const usuario = await knex('usuarios').where('email', email);
        if (usuario.length === 0) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario[0].senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'email ou senha invalidos' });
        }
        const token = jwt.sign({ id: usuario[0].id }, senhajwt, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario[0];

        return res.json({ usuario: usuarioLogado, token })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "erro interno no login" });
    }
}
const listarUsuarios = async function (req, res) {
    try {

        const usuarios = await knex('usuarios').select('*');


        return res.status(200).json(usuarios);
    } catch (error) {

        return res.status(500).json({ mensagem: 'erro interno no listar' });
    }
}


const atualizarUsuario = async function (req, res) {
    const { id } = req.params
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
    const { id } = req.params

    try {
        const usuario = await knex('usuarios').where('id', id)
        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' })
        }
        const usuarioDeletado = await knex('usuarios').where('id', id).delete()
        if (usuarioDeletado) {
            return res.status(200).json({ mensagem: 'usuario deletado com sucesso' })
        } else {
            return res.status(500).json({ mensagem: 'erro interno no deletar' })
        }
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no deletar' })
    }

}


module.exports = {
    cadastrarUsuario,
    loginUsuario,
    listarUsuarios,
    atualizarUsuario,
    deletarUsuario
}