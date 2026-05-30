// src/Dashboard.jsx
import { useState } from "react";
import "./Dashboard.css";
import ConsultaEstoque from "./ConsultaEstoque";
import NovaFerramenta from "./NovaFerramenta";
import NovoFuncionario from "./NovoFuncionario";
import RegistrarRetirada from "./RegistrarRetirada";
import RegistrarDevolucao from "./RegistrarDevolucao";
import TrocarSenhaModal from "./TrocarSenhaModal";
import CadastroAdmin from "./CadastroAdmin";
import Historico from "./Historico";

function Dashboard({ usuario, fazerLogout, senhaAtualizada }) {
  const [telaAtiva, setTelaAtiva] = useState("home");

  // A nossa "Chave Mestra" que define quem manda no estoque
  const isAdmin = usuario?.perfil === "admin";

  const renderizarTelaAtiva = () => {
    switch (telaAtiva) {
      case "estoque":
        return <ConsultaEstoque />;
      case "retirada":
        return <RegistrarRetirada />; // Tela Nova!
      case "devolucao":
        return <RegistrarDevolucao />; // Tela Nova!
      case "nova-ferramenta":
        return <NovaFerramenta />;
      case "novo-funcionario":
        return <NovoFuncionario />;
      case "cadastro-admin":
        return <CadastroAdmin />;
      case "historico":
        return <Historico />; // <--- Adicione aqui!
      default:
        return null;
    }
  };
  return (
    <div className="dashboard-container">
      {usuario?.troca_senha_obrigatoria === 1 && (
        <TrocarSenhaModal usuario={usuario} aoConcluir={senhaAtualizada} />
      )}

      {/* CABEÇALHO */}
      <header className="dashboard-header">
        <div className="brand">
          <h1>Offstock</h1>
          <span className="tag-plataforma">P-75 / ESTOQUE CENTRAL</span>
        </div>
        <div className="user-info">
          <span>
            {isAdmin ? "Responsável pelo Estoque" : "Operador"}:{" "}
            <strong>{usuario?.nome || "Visitante"}</strong>
          </span>
          <button className="btn-sair" onClick={fazerLogout}>
            Desconectar
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="dashboard-content">
        {telaAtiva === "home" ? (
          <div className="acoes-grid">
            {/* 🟢 VISÍVEL PARA TODOS (Admins e Funcionários Comuns) */}
            <div className="card-acao" onClick={() => setTelaAtiva("estoque")}>
              <div className="card-art estoque-art">
                <span>📦</span>
              </div>
              <h3>Consulta de Estoque</h3>
              <p>
                Visualize o inventário completo, verifique saldos e
                disponibilidade.
              </p>
            </div>

            {/* 🔴 VISÍVEL APENAS PARA O RESPONSÁVEL PELO ESTOQUE (Admin) */}
            {isAdmin && (
              <>
                <div
                  className="card-acao"
                  onClick={() => setTelaAtiva("retirada")}
                >
                  <div className="card-art retirada-art">
                    <span>📚</span>
                  </div>
                  <h3>Registrar Retirada</h3>
                  <p>
                    Dê saída em ferramentas ou consumíveis e atribua a um
                    funcionário.
                  </p>
                </div>

                <div
                  className="card-acao"
                  onClick={() => setTelaAtiva("devolucao")}
                >
                  <div className="card-art devolucao-art">
                    <span>↩️📦</span>
                  </div>
                  <h3>Registrar Devolução</h3>
                  <p>Receba materiais retornáveis e dê baixa na pendência.</p>
                </div>

                <div
                  className="card-acao"
                  onClick={() => setTelaAtiva("nova-ferramenta")}
                >
                  <div className="card-art ferramenta-art">
                    <span>🛠️</span>
                  </div>
                  <h3>Cadastrar Ferramenta</h3>
                  <p>
                    Adicione novas peças ou EPIs ao banco de dados do estoque.
                  </p>
                </div>

                <div
                  className="card-acao card-acao-warning"
                  onClick={() => setTelaAtiva("novo-funcionario")}
                >
                  <div className="card-art funcionario-art">
                    <span>🧑‍💼</span>
                  </div>
                  <h3>Novo Funcionário</h3>
                  <p>
                    Módulo Administrativo: Cadastre novos operadores e libere
                    acessos.
                  </p>
                </div>
                {/* 🛡️ NOVO CARD: CADASTRO DE NOVOS ADMINS */}
                <div
                  className="card-acao"
                  onClick={() => setTelaAtiva("cadastro-admin")}
                  style={{ borderColor: "#ef4444" }}
                >
                  <div
                    className="card-art"
                    style={{
                      color: "#ef4444",
                      fontSize: "32px",
                      marginBottom: "15px",
                    }}
                  >
                    🛡️
                  </div>
                  <h3 style={{ color: "#ef4444" }}>Novo Administrador</h3>
                  <p>
                    Módulo de Alta Segurança: Cadastre responsáveis com acesso
                    total ao estoque.
                  </p>
                </div>
                {/* 📜 NOVO CARD: HISTÓRICO */}
                <div
                  className="card-acao"
                  onClick={() => setTelaAtiva("historico")}
                  style={{ borderColor: "#a855f7" }}
                >
                  <div
                    className="card-art"
                    style={{
                      color: "#a855f7",
                      fontSize: "32px",
                      marginBottom: "15px",
                    }}
                  >
                    📜
                  </div>
                  <h3 style={{ color: "#a855f7" }}>Histórico / Logs</h3>
                  <p>
                    Auditoria completa: veja todo o histórico de retiradas e
                    devoluções do sistema.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="modulo-ativo">
            <button className="btn-voltar" onClick={() => setTelaAtiva("home")}>
              ⬅ Voltar ao Painel Principal
            </button>
            <div className="modulo-conteudo">{renderizarTelaAtiva()}</div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="status-indicator">
          <div className="dot"></div>
          <span>Sistema Operacional - Conectado ao Servidor Central</span>
        </div>
        <div>
          <span>Versão 1.1.0 | Setor de Manutenção</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
