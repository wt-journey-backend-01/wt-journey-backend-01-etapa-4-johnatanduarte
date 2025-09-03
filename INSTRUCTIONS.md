# Instruções de Configuração e Uso da API

Este documento fornece as instruções para configurar o ambiente de desenvolvimento e interagir com a API do Departamento de Polícia.

## 1. Configuração do Ambiente

### Pré-requisitos

- Docker e Docker Compose
- Node.js e npm

### Passos

1.  **Clone o repositório** e navegue até a pasta do projeto.

2.  **Crie o arquivo `.env`** na raiz do projeto com o seguinte conteúdo:

    ```
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=policia_db
    NODE_ENV=development
    JWT_SECRET=seu_segredo_super_secreto_aqui
    ```

    > **IMPORTANTE**: Altere o valor de `JWT_SECRET` para algo único e seguro.

3.  **Instale as dependências** do Node.js:

    ```bash
    npm install
    ```

4.  **Inicie o banco de dados** com Docker Compose:

    ```bash
    docker-compose up -d
    ```

5.  **Execute as migrations** para criar a estrutura do banco de dados:

    ```bash
    npx knex migrate:latest
    ```

6.  **Execute os seeds** para popular o banco com dados iniciais:
    ```bash
    npx knex seed:run
    ```
7.  **Inicie o servidor** da aplicação:
    ```bash
    npm start
    ```

A API estará rodando em `http://localhost:3000`.

## 2. Fluxo de Autenticação e Uso

A maioria dos endpoints desta API é protegida. Para acessá-los, você precisa de um token de autenticação.

### Passo 1: Registrar um Usuário

Faça uma requisição `POST` para `/auth/register` com os dados do novo usuário.

- **Endpoint**: `POST /auth/register`
- **Corpo (JSON)**:
  ```json
  {
    "nome": "Seu Nome",
    "email": "seuemail@exemplo.com",
    "senha": "SenhaForte123!"
  }
  ```

### Passo 2: Fazer Login para Obter um Token

Faça uma requisição `POST` para `/auth/login` com as credenciais do usuário registrado.

- **Endpoint**: `POST /auth/login`
- **Corpo (JSON)**:
  ```json
  {
    "email": "seuemail@exemplo.com",
    "senha": "SenhaForte123!"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Passo 3: Acessar Rotas Protegidas

Para acessar qualquer endpoint de `/agentes` ou `/casos`, você deve incluir o token no header `Authorization`.

- **Header**: `Authorization`
- **Valor**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a palavra "Bearer", um espaço, e depois o seu token).

Em ferramentas como o Postman, você pode configurar isso na aba "Authorization", selecionando o tipo "Bearer Token" e colando o seu token.

## 3. Documentação Completa da API

Para uma lista interativa de todos os endpoints, modelos de dados e para testar a API diretamente, acesse a documentação do Swagger no seu navegador:

[http://localhost:3000/docs](http://localhost:3000/docs)
