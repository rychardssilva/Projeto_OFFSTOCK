const movimentacoesService = require("../services/movimentacoes.service");

// Movimentacoes concentram retirada, devolucao, pendencias e historico
async function listarPendencias(req, res, next) {
  try {
    res.json(await movimentacoesService.listarPendencias());
  } catch (err) {
    next(err);
  }
}

async function registrarDevolucao(req, res, next) {
  try {
    res.json(await movimentacoesService.registrarDevolucao(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function registrarRetirada(req, res, next) {
  try {
    res.json(await movimentacoesService.registrarRetirada(req.body));
  } catch (err) {
    next(err);
  }
}

async function listarHistorico(req, res, next) {
  try {
    res.json(await movimentacoesService.listarHistorico());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listarPendencias,
  registrarDevolucao,
  registrarRetirada,
  listarHistorico,
};
