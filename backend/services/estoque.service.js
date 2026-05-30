const itensRepository = require("../repositories/itens.repository");

async function cadastrarItem(dados) {
  const resultado = await itensRepository.criarItem(dados);
  return { mensagem: "Material cadastrado!", id: resultado.lastID };
}

function listarItens() {
  return itensRepository.listarItens();
}

module.exports = {
  cadastrarItem,
  listarItens,
};
