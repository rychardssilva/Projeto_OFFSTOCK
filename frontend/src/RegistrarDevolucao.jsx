// src/RegistrarDevolucao.jsx
import { useState, useEffect } from "react";
import { buscarPendencias, registrarDevolucao } from "./services/movimentacaoService";

function RegistrarDevolucao() {
  const [pendencias, setPendencias] = useState([]);

  const formatarData = (valor, incluirHora = false) => {
    if (!valor) return "Sem prazo";

    const data = new Date(
      valor.includes("T") ? valor : valor.replace(" ", "T"),
    );
    if (Number.isNaN(data.getTime())) return valor;

    if (incluirHora) {
      const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(data);
      const horaFormatada = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(data);

      return `${dataFormatada} ${horaFormatada}`;
    }

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(data);
  };

  useEffect(() => {
    buscarPendencias()
      .then((dados) => setPendencias(dados))
      .catch((err) => console.error("Erro ao buscar pendências:", err));
  }, []);

  const handleDevolucao = async (id) => {
    try {
      const { resposta } = await registrarDevolucao(id);

      if (resposta.ok) {
        alert(`✅ Baixa realizada com sucesso e estoque restaurado!`);
        setPendencias(pendencias.filter((p) => p.id_movimentacao !== id));
      }
    } catch {
      alert("Erro ao conectar com o banco de dados.");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            color: "#00C4CC",
            fontSize: "26px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 0 8px 0",
          }}
        >
          📥 Receber Devoluções
        </h2>
        <p style={{ color: "#ccc", margin: 0, fontSize: "15px" }}>
          Abaixo estão listadas as ferramentas retornáveis que encontram-se em
          posse dos operadores.
        </p>
      </div>

      {pendencias.length === 0 ? (
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
          Tudo certo! Nenhuma ferramenta pendente de devolução no momento.
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
                  color: "#00C4CC",
                  fontSize: "14px",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#00C4CC",
                  fontSize: "14px",
                }}
              >
                Ferramenta
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#00C4CC",
                  fontSize: "14px",
                }}
              >
                Operador
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#00C4CC",
                  fontSize: "14px",
                }}
              >
                Retirada
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#00C4CC",
                  fontSize: "14px",
                }}
              >
                Prazo
              </th>
              <th
                style={{
                  padding: "0 16px 8px 16px",
                  color: "#00C4CC",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {pendencias.map((item) => {
              const atrasado = item.prazo && new Date(item.prazo) < new Date();

              // Se estiver atrasado, o fundo fica levemente vermelho. Se não, fica o preto 60% padrão.
              const fundoLinha = atrasado
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(0, 0, 0, 0.6)";
              const bordaLinha = atrasado
                ? "1px solid rgba(239, 68, 68, 0.3)"
                : "1px solid rgba(255, 255, 255, 0.05)";

              return (
                <tr
                  key={item.id_movimentacao}
                  style={{ backgroundColor: fundoLinha }}
                >
                  <td
                    style={{
                      padding: "16px",
                      borderRadius: "8px 0 0 8px",
                      color: "#aaa",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                      borderLeft: bordaLinha,
                    }}
                  >
                    #{item.id_movimentacao}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      fontWeight: "bold",
                      color: "#fff",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                    }}
                  >
                    {item.ferramenta}{" "}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#aaa",
                        marginLeft: "6px",
                      }}
                    >
                      (x{item.qtd})
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#fff",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                    }}
                  >
                    {item.operador}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: "#ddd",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                    }}
                  >
                    {formatarData(item.data_retirada, true)}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      color: atrasado ? "#ef4444" : "#ddd",
                      fontWeight: atrasado ? "bold" : "normal",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                    }}
                  >
                    {formatarData(item.prazo)} {atrasado && "⚠️"}
                  </td>
                  <td
                    style={{
                      padding: "16px",
                      borderRadius: "0 8px 8px 0",
                      borderTop: bordaLinha,
                      borderBottom: bordaLinha,
                      borderRight: bordaLinha,
                      textAlign: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDevolucao(item.id_movimentacao)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "transparent",
                        color: "#cc032e",
                        border: "1px solid ",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        transition: "0.2s",
                      }}
                    >
                      Dar Baixa
                    </button>
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

export default RegistrarDevolucao;
