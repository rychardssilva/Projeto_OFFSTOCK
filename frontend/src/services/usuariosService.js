import { apiJson } from "./api";

// Centraliza chamadas relacionadas a operadores, admins e senha
export function cadastrarOperador(dados) {
  return apiJson("/cadastro", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function cadastrarAdmin(dados) {
  return apiJson("/cadastro-admin", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarPrimeiraSenha(usuarioId, novaSenha) {
  return apiJson(`/usuarios/${usuarioId}/primeira-senha`, {
    method: "PUT",
    body: JSON.stringify({ novaSenha }),
  });
}

export async function buscarOperadores() {
  const { dados } = await apiJson("/operadores");
  return dados;
}
