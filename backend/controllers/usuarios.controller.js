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

module.exports = {
  cadastrarOperador,
  cadastrarAdmin,
  atualizarPrimeiraSenha,
  listarOperadores,
};
