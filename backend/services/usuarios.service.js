const usuariosRepository = require("../repositories/usuarios.repository");
const { criarErro } = require("./errors");

// Regras de cadastro e troca de senha ficam aqui, fora das rotas
async function cadastrarOperador(dados) {
  try {
    const resultado = await usuariosRepository.criarOperador(dados);
    return {
      mensagem: "Funcionário cadastrado com sucesso!",
      id: resultado.lastID,
    };
  } catch {
    throw criarErro(400, "Erro ao cadastrar. CPF ou Email já podem estar em uso.");
  }
}

async function cadastrarAdmin(dados) {
  try {
    const resultado = await usuariosRepository.criarAdmin({
      ...dados,
      trocaSenhaObrigatoria: 1,
    });

    return {
      mensagem: "Novo administrador registrado com sucesso!",
      id: resultado.lastID,
    };
  } catch {
    throw criarErro(
      400,
      "Não foi possível cadastrar. CPF ou Email já estão em uso no sistema.",
    );
  }
}

async function atualizarPrimeiraSenha(id, novaSenha) {
  if (!novaSenha || novaSenha.trim().length < 4) {
    throw criarErro(400, "A nova senha deve ter pelo menos 4 caracteres.");
  }

  if (novaSenha === "mudar123") {
    throw criarErro(400, "Escolha uma senha diferente da senha padrão.");
  }

  const resultado = await usuariosRepository.atualizarPrimeiraSenha(
    id,
    novaSenha,
  );

  if (resultado.changes === 0) {
    throw criarErro(404, "Usuário não encontrado.");
  }

  return { mensagem: "Senha atualizada com sucesso!" };
}

function listarOperadores() {
  return usuariosRepository.listarOperadoresParaSelect();
}

module.exports = {
  cadastrarOperador,
  cadastrarAdmin,
  atualizarPrimeiraSenha,
  listarOperadores,
};
