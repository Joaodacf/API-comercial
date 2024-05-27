
const knex = require("../db");

const categoriaLista = async function (req, res) {
    const categoria = await knex('categorias').select('*')
    return categoria;
}

const listagemCategoria = async function (req, res) {
    try {
        const categorias = await categoriaLista();
        return res.status(200).json(categorias)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: 'erro no categoria' })
    }
}

module.exports = {
    listagemCategoria
}