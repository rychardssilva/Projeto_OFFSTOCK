const estoqueService = require("../services/estoque.service");

// Controllers de itens delegam cadastro/listagem para o service de estoque
async function cadastrarItem(req, res, next) {
  try {
    res.status(201).json(await estoqueService.cadastrarItem(req.body));
  } catch (err) {
    next(err);
  }
}

async function listarItens(req, res, next) {
  try {
    res.json(await estoqueService.listarItens());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  cadastrarItem,
  listarItens,
};
