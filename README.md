
# API - comercial 

## Descrição

Este projeto é uma API RESTful desenvolvida em Node.js e Express.js, com PostgreSQL como banco de dados. A API permite aos usuários gerenciar usuários, produtos e categorias em um sistema de e-commerce. 

Os usuários podem realizar as seguintes ações:

- **Gerenciar usuários**: Os usuários podem se cadastrar, fazer login, visualizar todos os usuários, atualizar suas informações e deletar suas contas. Há também funcionalidades para esquecimento e redefinição de senha.

- **Gerenciar produtos**: Os usuários podem adicionar novos produtos, editar produtos existentes, visualizar detalhes de um produto específico, listar todos os produtos e deletar produtos. As operações de criação, atualização e deleção de produtos são protegidas por autenticação.

- **Listar categorias**: Os usuários podem visualizar todas as categorias disponíveis.

Este projeto utiliza o Knex.js para a construção de consultas SQL e o Jest para testes unitários. A autenticação é realizada através de tokens JWT.

## Instalação

Para instalar e executar este projeto localmente, siga estas etapas:

1. Clone o repositório:

```bash
git clone git@github.com:Joaodacf/API-comercial.git

2: Navegue até o diretório do projeto: cd API-comercial
3: Instale as dependências: NPM I
4: Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:  DB_URLHOST=your_database_url
5: Execute o projeto: Npm run dev

# Uso
GitHub Copilot
Claro, aqui está um exemplo de um arquivo README detalhado para o seu projeto. Por favor, substitua as partes relevantes com informações específicas do seu projeto.

Navegue até o diretório do projeto:
Instale as dependências:
Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:
Execute o projeto:
Uso
Para adicionar um produto, faça uma solicitação POST para /produto com o seguinte corpo JSON:
{
    "usuario_id": "1",
    "descricao": "Produto Teste",
    "quantidade_estoque": "100",
    "valor": "50.00",
    "categoria_id": "1"
}
Para Cadastrar um usuario, faça uma solicitação POST para /cadastro com o seguinte corpo JSON:
{
 "nome" : "seu Nome",
"email" : "seu email",
"senha": "alguma senha"
};

#Contribuição
Contribuições são sempre bem-vindas. Se você tiver alguma sugestão ou quiser contribuir com o projeto, sinta-se à vontade para abrir uma issue ou um pull request.

#Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

```



