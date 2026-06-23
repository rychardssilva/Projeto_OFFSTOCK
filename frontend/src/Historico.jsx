// src/Historico.jsx
import { useState, useEffect } from "react";
import { buscarHistorico } from "./services/movimentacaoService";

function Historico() {
  const [abaAtiva, setAbaAtiva] = useState("estoque");
  const [logsEstoque, setLogsEstoque] = useState([]);
  const [logsAuditoria, setLogsAuditoria] = useState([]);
  const [usuariosBloqueados, setUsuariosBloqueados] = useState([]);

  const formatarData = (valor) => {
    if (!valor) return "-";
    const data = new Date(valor.includes("T") ? valor : valor.replace(" ", "T"));
    if (Number.isNaN(data.getTime())) return valor;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(data);
  };

  const carregarDados = () => {
    buscarHistorico()
      .then((dados) => setLogsEstoque(dados))
      .catch((err) => console.error(err));

    fetch("http://localhost:3000/auditoria")
      .then((res) => res.json())
      .then((dados) => setLogsAuditoria(dados))
      .catch((err) => console.error(err));

    // Busca os operadores e agora consegue ver quem está bloqueado!
    fetch("http://localhost:3000/operadores")
      .then((res) => res.json())
      .then((dados) => {
        const filtrados = dados.filter(user => user.bloqueado === 1 || user.tentativas_login >= 3);
        setUsuariosBloqueados(filtrados);
      })
      .catch((err) => console.error("Erro ao buscar bloqueados:", err));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const executarDesbloqueio = async (id, nome) => {
    if (!window.confirm(`Tem certeza que deseja desbloquear o acesso de ${nome}?`)) return;

    try {
      const resposta = await fetch(`http://localhost:3000/usuarios/${id}/desbloquear`, {
        method: "POST"
      });

      if (resposta.ok) {
        alert(`✅ ${nome} foi desbloqueado com sucesso!`);
        carregarDados(); // Recarrega para sumir com o painel vermelho
      } else {
        alert("Erro ao tentar desbloquear o usuário.");
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: abaAtiva === "estoque" ? "#a855f7" : "#ef4444", fontSize: "26px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 0", transition: "0.3s" }}>
          {abaAtiva === "estoque" ? "📜 Histórico de Movimentações" : "🛡️ Auditoria do Sistema"}
        </h2>
        <p style={{ color: "#ccc", margin: 0, fontSize: "15px" }}>
          {abaAtiva === "estoque" ? "Registro completo de todas as saídas e entradas de materiais no sistema." : "Monitoramento de segurança: rastreamento de cadastros, senhas e acessos."}
        </p>
      </div>

      {/* Abas */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
        <button onClick={() => setAbaAtiva("estoque")} style={{ padding: "10px 20px", backgroundColor: abaAtiva === "estoque" ? "#a855f7" : "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" }}>
          📦 Movimentações de Estoque
        </button>
        <button onClick={() => setAbaAtiva("auditoria")} style={{ padding: "10px 20px", backgroundColor: abaAtiva === "auditoria" ? "#ef4444" : "rgba(0,0,0,0.4)", color: "#fff", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" }}>
          🛡️ Segurança e Cadastros {usuariosBloqueados.length > 0 && <span style={{backgroundColor: "#fff", color: "#ef4444", padding: "2px 6px", borderRadius: "50%", fontSize: "12px", marginLeft: "5px"}}>{usuariosBloqueados.length}</span>}
        </button>
      </div>

      {/* RENDERIZA A TABELA DE ESTOQUE COMPLETA */}
      {abaAtiva === "estoque" && (
        logsEstoque.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "12px", color: "#aaa" }}>
            Nenhuma movimentação de ferramenta encontrada.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", textAlign: "left" }}>
            <thead>
              <tr>
                <th style={{ padding: "0 16px 8px 16px", color: "#a855f7", fontSize: "14px" }}>ID Mov.</th>
                <th style={{ padding: "0 16px 8px 16px", color: "#a855f7", fontSize: "14px" }}>Ferramenta</th>
                <th style={{ padding: "0 16px 8px 16px", color: "#a855f7", fontSize: "14px" }}>Operador</th>
                <th style={{ padding: "0 16px 8px 16px", color: "#a855f7", fontSize: "14px" }}>Data Retirada</th>
                <th style={{ padding: "0 16px 8px 16px", color: "#a855f7", fontSize: "14px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logsEstoque.map((log) => {
                let status = log.retornavel === 0 || log.retornavel === "false"
                  ? { texto: "Consumido", corFundo: "rgba(156, 163, 175, 0.15)", corTexto: "#9ca3af", corBorda: "rgba(156, 163, 175, 0.4)" }
                  : log.data_devolvido
                  ? { texto: "Devolvido", corFundo: "rgba(74, 222, 128, 0.15)", corTexto: "#4ade80", corBorda: "rgba(74, 222, 128, 0.4)" }
                  : { texto: "Em Uso", corFundo: "rgba(251, 169, 76, 0.15)", corTexto: "#fba94c", corBorda: "rgba(251, 169, 76, 0.4)" };

                return (
                  <tr key={log.id} style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                    <td style={{ padding: "16px", borderRadius: "8px 0 0 8px", color: "#888" }}>#{log.id}</td>
                    <td style={{ padding: "16px", fontWeight: "bold", color: "#fff" }}>{log.ferramenta} <span style={{ fontSize: "12px", color: "#aaa" }}>(x{log.quantidade_retirada})</span></td>
                    <td style={{ padding: "16px", color: "#fff" }}>{log.operador}</td>
                    <td style={{ padding: "16px", color: "#ddd" }}>{formatarData(log.data_retirada)}</td>
                    <td style={{ padding: "16px", borderRadius: "0 8px 8px 0" }}>
                      <span style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", backgroundColor: status.corFundo, color: status.corTexto, border: `1px solid ${status.corBorda}` }}>
                        {status.texto}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}

      {/* RENDERIZA A TABELA DE AUDITORIA E DESBLOQUEIO */}
      {abaAtiva === "auditoria" && (
        <div>
          {usuariosBloqueados.length > 0 && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", borderRadius: "12px", padding: "20px", marginBottom: "30px" }}>
              <h3 style={{ color: "#ef4444", margin: "0 0 15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                ⚠️ Atenção: Contas Bloqueadas detectadas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {usuariosBloqueados.map(user => (
                  <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", padding: "12px 20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <strong style={{ color: "#fff" }}>{user.nome}</strong> 
                      <span style={{ color: "#aaa", fontSize: "14px", marginLeft: "10px" }}>({user.area_trabalho || "Admin"})</span>
                    </div>
                    <button 
                      onClick={() => executarDesbloqueio(user.id, user.nome)}
                      style={{ padding: "8px 16px", backgroundColor: "#4ade80", color: "#000", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 8px rgba(74, 222, 128, 0.3)" }}
                    >
                      🔓 Destravar Conta Agora
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {logsAuditoria.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "12px", color: "#aaa" }}>
              Nenhum log de segurança registrado ainda.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px", textAlign: "left" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0 16px 8px 16px", color: "#ef4444", fontSize: "14px" }}>ID Log</th>
                  <th style={{ padding: "0 16px 8px 16px", color: "#ef4444", fontSize: "14px" }}>Ação / Evento</th>
                  <th style={{ padding: "0 16px 8px 16px", color: "#ef4444", fontSize: "14px" }}>Usuário Alvo</th>
                  <th style={{ padding: "0 16px 8px 16px", color: "#ef4444", fontSize: "14px" }}>Descrição do Sistema</th>
                  <th style={{ padding: "0 16px 8px 16px", color: "#ef4444", fontSize: "14px" }}>Data / Hora</th>
                </tr>
              </thead>
              <tbody>
                {logsAuditoria.map((log) => (
                  <tr key={log.id} style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                    <td style={{ padding: "16px", borderRadius: "8px 0 0 8px", color: "#888" }}>#{log.id}</td>
                    <td style={{ padding: "16px", fontWeight: "bold", color: "#ef4444" }}>{log.acao}</td>
                    <td style={{ padding: "16px", color: "#fff", fontWeight: "bold" }}>{log.usuario_alvo}</td>
                    <td style={{ padding: "16px", color: "#ddd" }}>{log.descricao}</td>
                    <td style={{ padding: "16px", borderRadius: "0 8px 8px 0", color: "#aaa" }}>{formatarData(log.data_log)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Historico;