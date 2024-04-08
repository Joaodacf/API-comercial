const knex = require('knex');

const cadastrarPedido = async function (req, res) {
    const { usuario_id, observacao, pedido_produtos } = req.body

    let valorTotal = 0;

    if (!usuario_id) {
        return res.status(400).json('o campo cliente_id é obrigatório')
    }
    if (!observacao) {
        return res.status(400).json('o campo observacao é obrigatorio')
    }
    if (!pedido_produtos.length) {
        return res.status(400).json('o campo pedidos_produtos deve conter pelo menos um item')
    }
    try {
        const verificaUsuario = await knex('usuarios').where({
            id: usuario_id
        }).first()

        if (!verificaUsuario) {
            return res.status(404).json('usuario não encontrado')
        }

        for (const produto of pedido_produtos) {
            const validarProduto = await knex('produtos').where({
                id: produto.produto_id
            }).first()
            if (!validarProduto) {
                return res.status(404).json(`não existe produto para o id (${produto.produto_id}) informado`)
            }
            if (produto.quantidade_produto > validarProduto.quantidade_estoque) {
                return res.status(404).json(`não existe estoque suficiente para o produto de id (${produto.produto_id}) informado`)
            }
            valorTotal += (produto.quantidade_produto * validarProduto.valor)
            produto.valor_produto = validarProduto.valor
            produto.quantidade_estoque = validarProduto.quantidade_estoque
        }
        const cadastroPedido = await knex('pedidos').insert({
            cliente_id,
            observacao,
            valor_total: valorTotal
        }).returning('*')

        const pedido_id = cadastroPedido[0].id

        const formatacaoProdutos = pedido_produtos.map((produto) => {
            return {
                pedido_id,
                produto_id: produto.produto_id,
                quantidade_produto: produto.quantidade_produto,
                valor_produto: produto.valor_produto
            }
        })

        await knex('pedidos_produtos').insert(
            formatacaoProdutos
        )

        for (const produto of pedido_produtos) {
            await knex('produtos').update({
                quantidade_estoque: produto.quantidade_estoque - produto.quantidade_produto
            }).where({
                id: produto.produto_id
            })

        }
        return res.status(200).json('pedido cadastrado com sucesso!')

    } catch (error) {
        return res.status(500).json('algo inesperado ocorreu ao cadastrar o pedido')
    }
}

const listarPedidos = async function (req, res) {
    const { cliente_id } = req.query;

    let pedidos = [];
    let compra = [];

    try {
        if (cliente_id) {
            pedidos = await knex('pedidos').where({
                cliente_id
            })
        } else {
            pedidos = await knex('pedidos')
        }
        for (const pedido of pedidos) {
            const compras = {
                pedido: {
                    id: pedido.id,
                    valor: pedido.valor_total,
                    observacao: pedido.observacao,
                    cliente_id: pedido.cliente_id
                }
            }
            const pedido_produtos = await knex('pedido_produtos').where({
                pedido_id: pedido.id

            })
            compras.pedido.pedido_produtos = pedido_produtos

            compra.push(compras)

        }
        return res.status(200).json(compra)

    } catch (error) {
        return res.status(500).json('erro ao listar pedidos')
    }
}


module.exports = {
    cadastrarPedido,
    listarPedidos

}

