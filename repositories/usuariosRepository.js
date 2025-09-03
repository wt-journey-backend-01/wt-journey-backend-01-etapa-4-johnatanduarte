const db = require("../db/db");

/**
 * Repositório para operações de dados dos Usuários.
 * Lida com toda a comunicação com a tabela 'usuarios' no banco de dados.
 */

// Encontra um usuário pelo seu e-mail.
const findByEmail = (email) => {
  return db("usuarios").where({ email }).first();
};

// Cria um novo usuário no banco de dados.
const create = async (usuario) => {
  return db("usuarios").insert(usuario).returning(["id", "nome", "email"]);
};

// Remove um usuário pelo seu ID.
const remove = async (id) => {
  // .del() retorna o número de linhas afetadas.
  return db("usuarios").where({ id }).del();
};

module.exports = {
  findByEmail,
  create,
  remove,
};
