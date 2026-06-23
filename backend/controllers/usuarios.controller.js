const usuariosService = require("../services/usuarios.service");

// Mantem as respostas HTTP isoladas da regra de negocio de usuarios
async function cadastrarOperador(req, res, next) {
  try {
    res.status(201).json(await usuariosService.cadastrarOperador(req.body));
  } catch (err) {
    next(err);
  }
}

async function cadastrarAdmin(req, res, next) {
  try {
    res.status(201).json(await usuariosService.cadastrarAdmin(req.body));
  } catch (err) {
    next(err);
  }
}

async function atualizarPrimeiraSenha(req, res, next) {
  try {
    res.json(
      await usuariosService.atualizarPrimeiraSenha(
        req.params.id,
        req.body.novaSenha,
      ),
    );
  } catch (err) {
    next(err);
  }
}

async function listarOperadores(req, res, next) {
  try {
    res.json(await usuariosService.listarOperadores());
  } catch (err) {
    next(err);
  }
}

async function listarLogsAuditoria(req, res, next) {
  try {
    res.json(await usuariosService.listarLogsAuditoria());
  } catch (err) {
    next(err);
  }
}

// ✨ NOVA FUNÇÃO: Recebe os dados de login e envia para a camada de serviço
async function realizarLogin(req, res, next) {
  try {
    const { usuario, senha } = req.body;
    
    // Chama a regra de negócio das 3 tentativas que criamos no Service
    const usuarioLogado = await usuariosService.login(usuario, senha);
    
    // Se deu tudo certo, responde com os dados do usuário para o React logar
    res.json(usuarioLogado);
  } catch (err) {
    // Se o service lançou erro (bloqueado, senha errada), cai aqui e manda o status do erro
    next(err);
  }
}
async function desbloquearUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const resposta = await usuariosService.desbloquearUsuario(id);
    res.json(resposta);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  cadastrarOperador,
  cadastrarAdmin,
  atualizarPrimeiraSenha,
  listarOperadores,
  listarLogsAuditoria,
  realizarLogin, 
  desbloquearUsuario,// 
};