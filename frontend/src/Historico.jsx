// src/Historico.jsx
import { useState, useEffect } from "react";
import { buscarHistorico } from "./services/movimentacaoService";

function Historico() {
  const [logs, setLogs] = useState([]);

  // Função para deixar a data bonitinha com hora
  const formatarData = (valor) => {
    if (!valor) return "-";
    const data = new Date(
      valor.includes("T") ? valor : valor.replace(" ", "T"),
    );
    if (Number.isNaN(data.getTime())) return valor;

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data);
  };

  useEffect(() => {
    buscarHistorico()
      .then((dados) => setLogs(dados))
      .catch((err) => console.error("Erro ao buscar histórico:", err));
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#a855f7",
            fontSize: "26px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 0 8px 0",
          }}
        >
          📜 Auditoria e Histórico
        </h2>
        <p style={{ color: "#ccc", margin: 0, fontSize: "15px" }}>
          Registro completo de todas as saídas e entradas de materiais no
          sistema.
        </p>
      </div>

      {logs.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            color: "#aaa",
          }}
        >
          Nenhum registro de movimentação encontrado.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                ID Mov.
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                Ferramenta / Material
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                Operador
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                Data Retirada
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#a855f7",
                  fontSize: "14px",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              // Lógica para descobrir o status da movimentação
              let status;

              if (log.retornavel === 0 || log.retornavel === "false") {
                status = {
                  texto: "Consumido",
                  corFundo: "rgba(156, 163, 175, 0.15)",
                  corTexto: "#9ca3af",
                  corBorda: "rgba(156, 163, 175, 0.4)",
                };
              } else if (log.data_devolvido) {
                status = {
                  texto: "Devolvido",
                  corFundo: "rgba(74, 222, 128, 0.15)",
                  corTexto: "#4ade80",
                  corBorda: "rgba(74, 222, 128, 0.4)",
                };
              } else {
                status = {
                  texto: "Em Uso",
                  corFundo: "rgba(251, 169, 76, 0.15)",
                  corTexto: "#fba94c",
                  corBorda: "rgba(251, 169, 76, 0.4)",
                };
              }

              return (
                <tr
                  key={log.id}
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                >
                  <td
                    style={{
                      padding: "16px",
                      borderRadius: "8px 0 0 8px",
                      color: "#888",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      borderLeft: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    #{log.id}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {log.ferramenta}{" "}
                    <span style={{ fontSize: "12px", color: "#aaa" }}>
                      (x{log.quantidade_retirada})
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#fff",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {log.operador}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#ddd",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {formatarData(log.data_retirada)}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      borderRadius: "0 8px 8px 0",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      borderRight: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: status.corFundo,
                        color: status.corTexto,
                        border: `1px solid ${status.corBorda}`,
                      }}
                    >
                      {status.texto}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Historico;
