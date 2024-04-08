const knex = require('knex');

const cadastrarProduto = async function (req, res) {
    const { usuario } = req;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    if (!descricao) {
        return res.status(404).json('A descrição é obrigatória');
    }
    if (!quantidade_estoque) {
        return res.status(404).json('quantidade de estoque não informado');
    }
    if (!valor) {
        return res.status(404).json('obrigatório informar o valor');
    }
    if (!categoria_id) {
        return res.status(404).json('o campo categoria por id é obrigatorio informar');
    }
    try {
        const produto = await knex('produtos').insert({
            usuario_id: usuario.id,
            descricao,
            quantidade_estoque,
            valor,
            categoria_id
        }).returning('*')

        if (!produto[0]) {
            return res.status(400).json('o produto não foi cadastrado no sistema')
        }
        return res.status(200).json(produto[0])

    } catch (error) {
        return res.status(400).json({ mensagem: "erro no cadastro de produtos interno" });
    }

}
const editarProduto = async function (req, res) {
    const { usuario } = req;
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }
    try {
        const produto = await knex('produtos').where({
            id,
            usuario_id: usuario.id
        }).first()

        if (!produto) {
            return res.status(400).json("produto não encontrado")
        }

        const produtoEditado = await knex('produtos').where({
            id: produto.id,
            usuario_id: usuario.id
        })
            .update({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id
            })

        if (!produtoEditado) {
            return res.status(400).json('produto não foi atualizado')
        }
        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json({ mensagem: 'erro interno no editar produtos' });
    }
}
const detalharProdutoID = async function (req, res) {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({
            id,
            usuario_id: usuario.id
        }).first()

        if (!produto) {
            return res.status(404).json('produto não encontrado no sistema')
        }

    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no detalhar produto ' })
    }
}
const deletarProduto = async function (req, res) {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({
            id,
            usuario_id: usuario.id
        }).first()

        if (!produto) {
            return res.status(404).json('produto não encontrado')
        }

        const produtoExcluido = await knex('produtos').where({
            id,
            usuario_id: usuario.id
        })
            .del()

        if (!produtoExcluido) {
            return res.status(400).json('o produto não foi excluido')
        }

        return res.status(200).json(produtoExcluido).json({ mensagem: 'o produto foi excluido com sucesso!!' })
    } catch (error) {
        return res.status(400).json({ mensagem: 'erro interno no deletar produto' })
    }

}
const listaProdutos = async function (req, res) {
    const { usuario } = req;
    const { categoria_id } = req.query;

    let produtos = [];
    try {
        if (categoria_id) {
            const validarCategoria = await knex('categorias').where({
                id: categoria_id
            }).first();

            if (!validarCategoria) {
                return res.status(404).json('categoria não encontrada')
            }
            produtos = await knex('produtos')
                .where({ usuario_id: usuario.id })
                .andWhere({ categoria_id })
        } else {
            produtos = await knex('produtos')
                .where({ usuario_id: usuario.id })
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json({ mensagem: 'erro interno no listar produtos' })
    }
}

module.exports = {
    cadastrarProduto,
    editarProduto,
    detalharProdutoID,
    deletarProduto,
    listaProdutos
}