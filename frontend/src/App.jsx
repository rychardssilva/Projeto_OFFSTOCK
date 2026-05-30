// src/App.jsx
import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Setup from "./Setup";
import { verificarSetup } from "./services/authService";

function App() {
  const [telaAtual, setTelaAtual] = useState("carregando");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Assim que o App abre, ele faz essa verificação no backend
  useEffect(() => {
    const carregarSetup = async () => {
      try {
        const { dados } = await verificarSetup();

        if (dados.precisaSetup) {
          setTelaAtual("setup"); // Manda pra tela de configuração
        } else {
          setTelaAtual("login"); // Já tem admin? Vai pro login normal.
        }
      } catch (error) {
        console.error("Erro ao conectar no backend", error);
      }
    };

    carregarSetup();
  }, []);

  const entrarNoSistema = (dadosDoUsuario) => {
    setUsuarioLogado(dadosDoUsuario);
    setTelaAtual("dashboard");
  };

  const fazerLogout = () => {
    setUsuarioLogado(null);
    setTelaAtual("login");
  };

  const concluirTrocaSenha = () => {
    setUsuarioLogado((usuarioAtual) => ({
      ...usuarioAtual,
      troca_senha_obrigatoria: 0,
    }));
  };

  // Se o backend ainda não respondeu, mostra um estado de carregamento coerente com o restante do sistema
  if (telaAtual === "carregando") {
    return (
      <div className="app-loading">
        <div className="loading-mark">Offstock</div>
      </div>
    );
  }

  return (
    <>
      {telaAtual === "setup" && (
        <Setup irParaLogin={() => setTelaAtual("login")} />
      )}

      {telaAtual === "login" && <Login entrarNoSistema={entrarNoSistema} />}

      {telaAtual === "dashboard" && (
        <Dashboard
          usuario={usuarioLogado}
          fazerLogout={fazerLogout}
          senhaAtualizada={concluirTrocaSenha}
        />
      )}
    </>
  );
}

export default App;
