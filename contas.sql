CREATE table public.usuarios (
    id SERIAL NOT NULL PRIMARY KEY, nome VARCHAR NOT NULL, email VARCHAR NOT NULL UNIQUE, senha VARCHAR NOT NULl
)

CREATE TABLE public.categorias (
    id serial NOT NULL PRIMARY KEY, descricao varchar NOT NULL
)
create table public.pedidos (
    id SERIAL NOT NULL PRIMARY KEY, usuario_id VARCHAR NOT NULL, observacao varchar not NULL, valor_total VARCHAR NOT NULL
)
create table public.pedidos_produtos (
    id SERIAL NOT NULL PRIMARY KEY, pedido_id VARCHAR NOT NULL, produto_id varchar not NULL, quantidade_produto VARCHAR NOT NULL, valor_produto VARCHAR NOT NULL
)
create table public.produtos (
    id SERIAL NOT NULL PRIMARY KEY, descricao VARCHAR NOT NULL, quantidade_estoque varchar not NULL, valor VARCHAR NOT NULL, categoria_id VARCHAR NOT NULL
)