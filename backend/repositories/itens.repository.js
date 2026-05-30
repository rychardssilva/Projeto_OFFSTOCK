const database = require("../database");

// Repositorio de itens encapsula consultas e atualizacoes do estoque
function criarItem({ nome, quantidade, retornavel, localizacao }) {
  return database.run(
    `INSERT INTO itens (nome, quantidade, retornavel, localizacao) VALUES (?, ?, ?, ?)`,
    [nome, quantidade, retornavel, localizacao],
  );
}

function listarItens() {
  return database.all(`SELECT * FROM itens`);
}

function baixarEstoque(itemId, quantidade) {
  return database.run(
    `UPDATE itens SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?`,
    [quantidade, itemId, quantidade],
  );
}

function restaurarEstoque(itemId, quantidade) {
  return database.run(`UPDATE itens SET quantidade = quantidade + ? WHERE id = ?`, [
    quantidade,
    itemId,
  ]);
}

module.exports = {
  criarItem,
  listarItens,
  baixarEstoque,
  restaurarEstoque,
};
