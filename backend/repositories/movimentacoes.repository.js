const database = require("../database");

// SQL de movimentacoes agora fica isolado para services usarem sem se preocupar com detalhes do banco
function listarPendencias() {
  return database.all(`
        SELECT m.id as id_movimentacao, i.nome as ferramenta, u.nome as operador,
               m.quantidade_retirada as qtd, m.data_retirada, m.data_devolucao_prevista as prazo
        FROM movimentacoes m
        JOIN itens i ON m.item_id = i.id
        JOIN usuarios u ON m.usuario_id = u.id
        WHERE m.data_devolvido IS NULL AND i.retornavel = 1
    `);
}

function buscarPorId(id) {
  return database.get(
    `SELECT item_id, quantidade_retirada FROM movimentacoes WHERE id = ?`,
    [id],
  );
}

function marcarComoDevolvida(id) {
  return database.run(
    `UPDATE movimentacoes SET data_devolvido = CURRENT_TIMESTAMP WHERE id = ?`,
    [id],
  );
}

function criarRetirada({ ferramentaId, operadorId, quantidade, dataPrevista }) {
  return database.run(
    `INSERT INTO movimentacoes (item_id, usuario_id, quantidade_retirada, data_devolucao_prevista)
     VALUES (?, ?, ?, ?)`,
    [ferramentaId, operadorId, quantidade, dataPrevista || null],
  );
}

function listarHistorico() {
  return database.all(`
        SELECT m.id, i.nome as ferramenta, i.retornavel, u.nome as operador,
               m.quantidade_retirada, m.data_retirada, m.data_devolvido
        FROM movimentacoes m
        JOIN itens i ON m.item_id = i.id
        JOIN usuarios u ON m.usuario_id = u.id
        ORDER BY m.data_retirada DESC
    `);
}

module.exports = {
  listarPendencias,
  buscarPorId,
  marcarComoDevolvida,
  criarRetirada,
  listarHistorico,
};
