const authService = require("../services/auth.service");

// Controllers traduzem HTTP para chamadas de service, sem SQL direto
async function checkSetup(req, res, next) {
  try {
    res.json(await authService.verificarSetup());
  } catch (err) {
    next(err);
  }
}

async function setup(req, res, next) {
  try {
    res.status(201).json(await authService.configurarPrimeiroAdmin(req.body));
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    res.status(200).json(await authService.login(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  checkSetup,
  setup,
  login,
};
