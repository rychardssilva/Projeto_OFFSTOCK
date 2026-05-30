import { apiJson } from "./api";

// Centraliza retiradas, devolucoes, pendencias e historico
export async function buscarPendencias() {
  const { dados } = await apiJson("/pendencias");
  return dados;
}

export function registrarDevolucao(id) {
  return apiJson(`/devolucao/${id}`, {
    method: "PUT",
  });
}

export function registrarRetirada(dados) {
  return apiJson("/retirada", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export async function buscarHistorico() {
  const { dados } = await apiJson("/historico");
  return dados;
}
