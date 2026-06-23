const database = require("../database");

// Repositories sao a unica camada que conhece o SQL de usuarios
function contarAdmins() {
  return database.get(
    "SELECT COUNT(*) as count FROM usuarios WHERE perfil = 'admin'",
  );
}

async function criarAdmin({ nome, cpf, email, senha, trocaSenhaObrigatoria = 1 }) {
  // 1. Cria o usuário normalmente
  const resultado = await database.run(
    `INSERT INTO usuarios (nome, cpf, email, senha, perfil, troca_senha_obrigatoria)
     VALUES (?, ?, ?, ?, 'admin', ?)`,
    [nome, cpf, email, senha, trocaSenhaObrigatoria],
  );

  
  await database.run(
    `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
    ['NOVO_ADMIN', 'Administrador com acesso total cadastrado no sistema.', nome]
  );

  return resultado;
}

function buscarPorLogin(usuario) {
  return database.get(
    `SELECT * FROM usuarios WHERE (email = ? OR cpf = ?)`,
    [usuario, usuario]
  );
}
function incrementarTentativas(id) {
  return database.run(
    `UPDATE usuarios SET tentativas_login = tentativas_login + 1 WHERE id = ?`,
    [id]
  );
}


function bloquearUtilizador(id, novoContador, dataBloqueio) {
  return database.run(
    `UPDATE usuarios SET bloqueado = 1, bloqueado_em = ?, contador_bloqueios = ? WHERE id = ?`,
    [dataBloqueio, novoContador, id]
  );
}


function autoDesbloquear(id) {
  return database.run(
    `UPDATE usuarios SET bloqueado = 0, tentativas_login = 0 WHERE id = ?`,
    [id]
  );
}


function desbloquearUsuario(id) {
  return database.run(
    `UPDATE usuarios SET bloqueado = 0, tentativas_login = 0, contador_bloqueios = 0, bloqueado_em = NULL WHERE id = ?`,
    [id]
  );
}

function resetarTentativas(id) {
  return database.run(
    `UPDATE usuarios SET tentativas_login = 0, contador_bloqueios = 0, bloqueado_em = NULL WHERE id = ?`,
    [id]
  );
}
async function criarOperador({
  nome,
  cpf,
  area_trabalho,
  idade,
  email,
  celular,
  senha,
}) {
  // 1. Cria o operador normalmente
  const resultado = await database.run(
    `INSERT INTO usuarios (nome, cpf, area_trabalho, idade, email, celular, senha, perfil, troca_senha_obrigatoria)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'operador', 1)`,
    [nome, cpf, area_trabalho, idade, email, celular, senha],
  );

  // 📜 2. O Dedo-Duro: Registra a ação no Log
  await database.run(
    `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
    ['NOVO_OPERADOR', `Operador cadastrado para o setor: ${area_trabalho}.`, nome]
  );

  return resultado;
}

async function atualizarPrimeiraSenha(id, novaSenha) {
  // 1. Atualiza a senha
  const resultado = await database.run(
    `UPDATE usuarios SET senha = ?, troca_senha_obrigatoria = 0 WHERE id = ?`,
    [novaSenha, id],
  );

  // 📜 2. O Dedo-Duro: Registra que uma senha foi alterada (sem expor a senha!)
  await database.run(
    `INSERT INTO logs_sistema (acao, descricao, usuario_alvo) VALUES (?, ?, ?)`,
    ['TROCA_SENHA', 'Usuário atualizou a credencial provisória para uma definitiva e segura.', `ID do Usuário: ${id}`]
  );

  return resultado;
}

function listarOperadoresParaSelect() {
 
  return database.all(`SELECT id, nome, cpf, area_trabalho, bloqueado, tentativas_login FROM usuarios`);
}

function listarLogsAuditoria() {
  return database.all(`SELECT * FROM logs_sistema ORDER BY data_log DESC`);
}

function desbloquearUsuario(id) {
  // Essa é a chave-mestra: zera tudo de uma vez!
  return database.run(
    `UPDATE usuarios SET bloqueado = 0, tentativas_login = 0, contador_bloqueios = 0, bloqueado_em = NULL WHERE id = ?`,
    [id]
  );
}
module.exports = {
  contarAdmins,
  criarAdmin,
  listarLogsAuditoria,
  buscarPorLogin,
  criarOperador,
  atualizarPrimeiraSenha,
  listarOperadoresParaSelect,
  incrementarTentativas,
  bloquearUtilizador,    
  autoDesbloquear,       
  desbloquearUsuario,    
  resetarTentativas, 
   desbloquearUsuario,       
};