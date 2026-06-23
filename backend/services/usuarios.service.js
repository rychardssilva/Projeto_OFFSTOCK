const usuariosRepository = require("../repositories/usuarios.repository");
const { criarErro } = require("./errors");
const database = require("../database"); // Importado para gravar o log de bloqueio

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
  // ✨ ATUALIZADO: Validação de Senha Forte também no Backend por segurança!
  const regexSenhaForte = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!novaSenha || !regexSenhaForte.test(novaSenha)) {
    throw criarErro(
      400, 
      "A senha não cumpre os requisitos: mínimo 8 caracteres, 1 letra maiúscula e 1 número."
    );
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

async function listarLogsAuditoria() {
  return await usuariosRepository.listarLogsAuditoria();
}



async function login(usuario, senhaFornecida) {
  const user = await usuariosRepository.buscarPorLogin(usuario);
  
  if (!user) {
    throw criarErro(401, "Usuário ou senha incorretos.");
  }

  
  if (user.bloqueado === 1) {
    const agora = new Date();
    const bloqueadoEm = new Date(user.bloqueado_em);
    const diferencaMs = agora - bloqueadoEm; // Diferença de tempo em milissegundos
    
   
    const tempoCastigo = user.contador_bloqueios === 1 
      ? 1 * 60 * 60 * 1000  // 1 hora em ms
      : 24 * 60 * 60 * 1000; // 24 horas em ms
    
    if (diferencaMs >= tempoCastigo) {
     
      await usuariosRepository.autoDesbloquear(user.id);
      
      // Atualiza nossas variáveis locais para o fluxo de login continuar normalmente
      user.bloqueado = 0;
      user.tentativas_login = 0;

      await database.run(
        `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
        ['AUTO_DESBLOQUEIO', `Tempo de penalidade expirou. Conta liberada automaticamente para novas tentativas.`, user.nome]
      );
    } else {
  
      const restanteMs = tempoCastigo - diferencaMs;
      const horasRestantes = Math.floor(restanteMs / (1000 * 60 * 60));
      const minutosRestantes = Math.ceil((restanteMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let tempoTexto = horasRestantes > 0 
        ? `${horasRestantes}h e ${minutosRestantes}min` 
        : `${minutosRestantes} min`;

      throw criarErro(403, `🚨 Conta Bloqueada! Aguarde ${tempoTexto} para tentar novamente ou solicite o desbloqueio manual para um Administrador.`);
    }
  }

  // 2. VERIFICAÇÃO NORMAL DA SENHA
  if (user.senha === senhaFornecida) {
    // Sucesso! Limpa o histórico de erros do usuário
    await usuariosRepository.resetarTentativas(user.id);
    return user; 
  } else {
    // Errou a senha: soma +1 no contador de erros do banco
    await usuariosRepository.incrementarTentativas(user.id);
    const tentativasAtuais = user.tentativas_login + 1;

    if (tentativasAtuais >= 3) {
      // Tranca a conta e soma +1 no histórico de bloqueios dele
      const novoContadorBloqueios = (user.contador_bloqueios || 0) + 1;
      const dataAgora = new Date().toISOString(); // Guarda o momento exato em texto ISO
      
      await usuariosRepository.bloquearUtilizador(user.id, novoContadorBloqueios, dataAgora);
      
      const tempoTextoBloqueio = novoContadorBloqueios === 1 ? "1 hora" : "24 horas";
      
      // Registra o bloqueio severo na Auditoria
      await database.run(
        `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
        ['CONTA_BLOQUEADA', `Conta trancada por ${tempoTextoBloqueio} (Bloqueio nº ${novoContadorBloqueios}) após 3 erros de senha.`, user.nome]
      );

      throw criarErro(403, `🚨 Tentativas esgotadas! Sua conta foi suspensa por ${tempoTextoBloqueio}.`);
    }

    throw criarErro(401, `Senha incorreta! Você tem mais ${3 - tentativasAtuais} tentativa(s) antes do bloqueio.`);
  }
}
async function desbloquearUsuario(id) {
  const resultado = await usuariosRepository.desbloquearUsuario(id);

  if (resultado.changes === 0) {
    throw criarErro(404, "Usuário não encontrado.");
  }

 
  await database.run(
    `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
    ['DESBLOQUEIO_MANUAL', 'A conta foi totalmente destrancada por um Administrador.', `ID do Usuário: ${id}`]
  );

  return { mensagem: "Usuário desbloqueado com sucesso! Ele já pode logar." };
}

module.exports = {
  cadastrarOperador,
  cadastrarAdmin,
  atualizarPrimeiraSenha,
  listarOperadores,
  listarLogsAuditoria,
  login, //
  desbloquearUsuario, 
};