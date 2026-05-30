const API_URL = "http://localhost:3000";

// Ponto unico para trocar URL base, headers ou autenticacao futuramente
export async function apiFetch(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function apiJson(path, options = {}) {
  const resposta = await apiFetch(path, options);
  const dados = await resposta.json();

  return { resposta, dados };
}
