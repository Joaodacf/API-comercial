const jwt = require('jsonwebtoken');
const senhajwt = require('../senhajwt');
const knex = require('../db');


const verificacaoToken = async function (req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }
    const token = authorization.split(' ')[1];
    try {
        const { id } = jwt.verify(token, senhajwt);
        const usuario = await knex('usuarios').where({ id }).first();
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Não autorizado' });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
    }
}

module.exports = {
    verificacaoToken
}