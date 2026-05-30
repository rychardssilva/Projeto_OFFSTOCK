const usuariosRepository = require("../repositories/usuarios.repository");
const { criarErro } = require("./errors");

// Esses services concentram regras de negocio e deixam SQL nos repositories
async function verificarSetup() {
  const row = await usuariosRepository.contarAdmins();
  return { precisaSetup: row.count === 0 };
}

async function configurarPrimeiroAdmin(dados) {
  const row = await usuariosRepository.contarAdmins();

  if (row.count > 0) {
    throw criarErro(403, "O sistema já possui um administrador!");
  }

  try {
    await usuariosRepository.criarAdmin(dados);
    return { mensagem: "Super Admin configurado com sucesso!" };
  } catch {
    throw criarErro(400, "Erro ao criar Admin. CPF ou Email já existem.");
  }
}

async function login({ usuario, senha }) {
  const usuarioEncontrado = await usuariosRepository.buscarPorLogin(
    usuario,
    senha,
  );

  if (!usuarioEncontrado) {
    throw criarErro(401, "Usuário ou senha incorretos.");
  }

  return { mensagem: "Login aprovado!", usuario: usuarioEncontrado };
}

module.exports = {
  verificarSetup,
  configurarPrimeiroAdmin,
  login,
};
