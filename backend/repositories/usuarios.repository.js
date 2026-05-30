const database = require("../database");

// Repositories sao a unica camada que conhece o SQL de usuarios
function contarAdmins() {
  return database.get(
    "SELECT COUNT(*) as count FROM usuarios WHERE perfil = 'admin'",
  );
}

function criarAdmin({ nome, cpf, email, senha, trocaSenhaObrigatoria = 0 }) {
  return database.run(
    `INSERT INTO usuarios (nome, cpf, email, senha, perfil, troca_senha_obrigatoria)
     VALUES (?, ?, ?, ?, 'admin', ?)`,
    [nome, cpf, email, senha, trocaSenhaObrigatoria],
  );
}

function buscarPorLogin(usuario, senha) {
  return database.get(
    `SELECT * FROM usuarios WHERE (email = ? OR cpf = ?) AND senha = ?`,
    [usuario, usuario, senha],
  );
}

function criarOperador({
  nome,
  cpf,
  area_trabalho,
  idade,
  email,
  celular,
  senha,
}) {
  return database.run(
    `INSERT INTO usuarios (nome, cpf, area_trabalho, idade, email, celular, senha, perfil, troca_senha_obrigatoria)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'operador', 1)`,
    [nome, cpf, area_trabalho, idade, email, celular, senha],
  );
}

function atualizarPrimeiraSenha(id, novaSenha) {
  return database.run(
    `UPDATE usuarios SET senha = ?, troca_senha_obrigatoria = 0 WHERE id = ?`,
    [novaSenha, id],
  );
}

function listarOperadoresParaSelect() {
  return database.all(`SELECT id, nome, cpf, area_trabalho FROM usuarios`);
}

module.exports = {
  contarAdmins,
  criarAdmin,
  buscarPorLogin,
  criarOperador,
  atualizarPrimeiraSenha,
  listarOperadoresParaSelect,
};
