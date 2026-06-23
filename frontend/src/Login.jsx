// src/Login.jsx
import { useState } from "react";
import "./Login.css";
import { login } from "./services/authService";

function Login({ entrarNoSistema }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { resposta, dados } = await login({ usuario, senha });

      if (resposta.ok) {
        // 🔥 CORREÇÃO AQUI: Passamos apenas 'dados' porque o nosso backend 
        // já manda o objeto do usuário inteiro (com id, nome, perfil) direto na raiz!
        entrarNoSistema(dados); 
      } else {
        // Aproveitei para garantir que o alerta mostre a mensagem certinha das 3 tentativas
        alert(dados.erro || dados.mensagem || "Erro de autenticação.");
      }
    } catch {
      alert("Erro ao conectar com o servidor central.");
    }
  };
  return (
    <div className="login-container">
      {/* LADO ESQUERDO: Identidade Visual e Tagline */}
      <div className="login-brand-section">
        <h1 className="brand-title">Offstock</h1>
        <p className="brand-tagline">Gestão de Materiais da Plataforma</p>
      </div>

      {/* LADO DIREITO: Card de Autenticação */}
      <div className="login-card-section">
        <div className="login-card">
          <span className="login-kicker">Acesso ao sistema</span>
          <h2>Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Digite seu email..."
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Digite sua senha..."
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-acessar">
              Acessar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
