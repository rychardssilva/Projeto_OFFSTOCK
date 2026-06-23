const movimentacoesService = require("../services/movimentacoes.service");
// Importamos o repositório para fazer a checagem de segurança
const movimentacoesRepository = require("../repositories/movimentacoes.repository");

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
    // ✨ PASSO 1 DA ASSINATURA: Pegamos a senha do Admin que o React vai enviar no "body"
    const { senhaAdmin } = req.body;
    
    // E passamos o ID da ferramenta e a senha para o Service conferir
    res.json(await movimentacoesService.registrarDevolucao(req.params.id, senhaAdmin));
  } catch (err) {
    next(err);
  }
}

async function registrarRetirada(req, res, next) {
  try {
    const { operadorId } = req.body;
    
    const resultado = await movimentacoesRepository.verificarAtrasosOperador(operadorId);

    if (resultado.atrasos > 0) {
      return res.status(403).json({ 
        erro: "Bloqueio de Segurança: Este operador possui ferramentas com a devolução atrasada e não pode retirar novos materiais." 
      });
    }

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