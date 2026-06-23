// src/CadastroAdmin.jsx
import { useState } from "react";
import { cadastrarAdmin } from "./services/usuariosService";

function CadastroAdmin() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      // Igual ao que é feito no operador: injetamos a senha padrão 'mudar123' aqui
      const { resposta, dados } = await cadastrarAdmin({ 
        nome, 
        cpf, 
        email, 
        senha: 'mudar123' 
      });

      if (resposta.ok) {
        alert(`✅ Administrador ${nome} cadastrado! A senha padrão dele é: mudar123`);
        setNome("");
        setCpf("");
        setEmail("");
      } else {
        alert(`❌ Erro: ${dados.erro}`);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px 20px",
      }}
    >
      {/* Cabeçalho do Módulo com Linha Divisória */}
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "20px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            color: "#ef4444",
            fontSize: "28px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 0 10px 0",
          }}
        >
          <span style={{ fontSize: "30px" }}>🛡️</span> Cadastro de Administrador
        </h2>
        <p
          style={{
            color: "#aaa",
            margin: 0,
            fontSize: "15px",
            lineHeight: "1.5",
          }}
        >
          Preencha os dados abaixo para gerar uma credencial com{" "}
          <strong>permissões totais</strong>. <br />
          A senha inicial provisória do sistema será gerada automaticamente.
        </p>
      </div>

      <form
        onSubmit={handleCadastro}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {/* Linha 1: Nome e CPF */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{ color: "#ccc", fontSize: "14px", fontWeight: "500" }}
            >
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Ex: João da Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                outline: "none",
                fontSize: "15px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{ color: "#ccc", fontSize: "14px", fontWeight: "500" }}
            >
              CPF (Somente Números)
            </label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                outline: "none",
                fontSize: "15px",
              }}
              required
            />
          </div>
        </div>

        {/* Linha 2: E-mail Corporativo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ccc", fontSize: "14px", fontWeight: "500" }}>
            E-mail Corporativo
          </label>
          <input
            type="email"
            placeholder="admin@offstock.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              outline: "none",
              fontSize: "15px",
            }}
            required
          />
        </div>

        {/* Linha 3: Botão de Envio */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <button
            type="submit"
            style={{
              padding: "14px 32px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(239, 68, 68, 0.25)",
            }}
          >
            Autorizar Novo Admin
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastroAdmin;