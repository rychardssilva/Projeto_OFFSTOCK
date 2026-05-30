import { apiJson } from "./api";

// Servico de autenticacao/setup usado por App, Login e Setup
export function verificarSetup() {
  return apiJson("/check-setup");
}

export function configurarPrimeiroAdmin(dados) {
  return apiJson("/setup", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function login(dados) {
  return apiJson("/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
