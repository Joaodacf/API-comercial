const knex = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const senhajwt = require("../senhajwt.js");
const transportador = require("../email.js")
const { getUserByEmail, getUserById } = require('../services/users.service.js');



const cadastrarUsuario = async function (req, res) {
    const { nome, email, senha } = req.body;

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
        const verificacaoPorEmail = await getUserByEmail({ email });
        if (verificacaoPorEmail) {
            return res.status(409).json({ mensagem: 'email ja cadastrado' })
        }

        const senhaHash = await bcrypt.hash(senha, 10)
        const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaHash })

        return res.status(201).json({ mensagem: "usuario cadastrado com sucesso" });


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

        const usuario = await getUserByEmail({ email });

        if (!usuario) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'email ou senha invalidos' });
        }
        const token = jwt.sign({ id: usuario.id }, senhajwt, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario;

        return res.json({ usuario: usuarioLogado, token })

    } catch (error) {
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
        const usuario = getUserById({ id });

        if (!usuario) {
            return res.status(404).json({ mensagem: 'usuario nao encontrado' })
        }
        const verificacaoPorEmail = await getUserByEmail({ email });
        if (verificacaoPorEmail && verificacaoPorEmail.id != id) {
            return res.status(409).json({ mensagem: 'email ja cadastrado' })
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
        const usuario = getUserById({ id });
        if (!usuario) {
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
const esqueciSenha = async function (req, res) {
    const { email } = req.body;

    try {
        const verificacaoPorEmail = await getUserByEmail({ email });
        if (!verificacaoPorEmail) {
            return res.status(409).json({ mensagem: 'usuario não encontrado ' })
        }
        const token = jwt.sign({ id: verificacaoPorEmail.id }, senhajwt, { expiresIn: 1000 * 60 * 10 });

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${verificacaoPorEmail.nome} <${verificacaoPorEmail.email}>`,
            subject: 'recuperação de senha',
            text: `para redefinir sua senha , copie o link abaixo e cole numa nova aba
            ${process.env.REDIRECT_PASSWORD_REDEFINE}?token=${token}`

        })
        return res.status(200).json({ mensagem: 'email enviado com sucesso' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'erro interno na redefinição de senhaS' })

    }
}
const redefinirSenha = async function (req, res) {
    const { senha, confirmacaoSenha } = req.body
    const { token } = req.query
    try {
        if (senha != confirmacaoSenha) {
            return res.status(400).json({ mensagem: 'senhas não conferem' })
        }
        if (!token) {
            return res.status(400).json({ mensagem: 'token não encontrado' })
        }
        const { id } = jwt.verify(token, senhajwt)

        const usuario = await getUserById({ id })
        if (!usuario) {
            return res.status(404).json({ mensagem: 'usuario não encontrado' })
        }
        const senhaCriptografada = await bcrypt.hashSync(senha, 10)
        const novoUsuario = await knex('usuarios').update({ senha: senhaCriptografada })

        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${usuario.nome} <${usuario.email}>`,
            subject: 'verificacao de email',
            text: 'sua senha foi atualizada com sucesso'
        })

        return res.status(200).json({ mensagem: 'senha redefinida com sucesso' })

    } catch (error) {
        return res.status(500).json({ mensagem: 'erro ao redefinir sua senha' })
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    listarUsuarios,
    atualizarUsuario,
    deletarUsuario,
    esqueciSenha,
    redefinirSenha
}