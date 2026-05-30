import { apiJson } from "./api";

// Centraliza leitura e cadastro de materiais do estoque
export async function buscarItens() {
  const { dados } = await apiJson("/itens");
  return dados;
}

export function cadastrarItem(dados) {
  return apiJson("/itens", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
