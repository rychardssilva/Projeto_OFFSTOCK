const itensRepository = require("../repositories/itens.repository");
const movimentacoesRepository = require("../repositories/movimentacoes.repository");
const { criarErro } = require("./errors");

// Regras que alteram estoque ficam juntas para evitar logica nas rotas e controllers
function listarPendencias() {
  return movimentacoesRepository.listarPendencias();
}

async function registrarDevolucao(movimentacaoId) {
  const movimentacao = await movimentacoesRepository.buscarPorId(movimentacaoId);

  if (!movimentacao) {
    throw criarErro(404, "Registro não encontrado.");
  }

  await movimentacoesRepository.marcarComoDevolvida(movimentacaoId);
  await itensRepository.restaurarEstoque(
    movimentacao.item_id,
    movimentacao.quantidade_retirada,
  );

  return { mensagem: "Baixa realizada e estoque restaurado com sucesso!" };
}

async function registrarRetirada(dados) {
  const resultadoBaixa = await itensRepository.baixarEstoque(
    dados.ferramentaId,
    dados.quantidade,
  );

  if (resultadoBaixa.changes === 0) {
    throw criarErro(400, "Estoque insuficiente!");
  }

  await movimentacoesRepository.criarRetirada(dados);
  return { mensagem: "Retirada registrada com sucesso!" };
}

function listarHistorico() {
  return movimentacoesRepository.listarHistorico();
}

module.exports = {
  listarPendencias,
  registrarDevolucao,
  registrarRetirada,
  listarHistorico,
};
