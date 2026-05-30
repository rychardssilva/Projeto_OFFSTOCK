// src/ConsultaEstoque.jsx
import { useState, useEffect } from "react";
import { buscarItens } from "./services/estoqueService";

function ConsultaEstoque() {
  const [itens, setItens] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroLocal, setFiltroLocal] = useState("Todos");

  useEffect(() => {
    buscarItens()
      .then((dados) => setItens(dados))
      .catch((err) => console.error("Erro ao buscar estoque", err));
  }, []);

  const itensFiltrados = itens.filter((item) => {
    const bateNome = item.nome.toLowerCase().includes(busca.toLowerCase());
    const bateLocal =
      filtroLocal === "Todos" || item.localizacao === filtroLocal;
    return bateNome && bateLocal;
  });

  return (
    <div style={{ width: "100%" }}>
      {/* Cabeçalho da Tela */}
      <div style={{ marginBottom: "25px" }}>
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
          📦 Inventário Geral
        </h2>
        <p style={{ color: "#ccc", margin: 0, fontSize: "15px" }}>
          Consulte e filtre todos os materiais disponíveis na plataforma.
        </p>
      </div>

      {/* Filtros com o "fundinho preto" transparente */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        {/* Aqui está a Barra de Busca consertada! */}
        <input
          type="text"
          placeholder="🔍 Buscar ferramenta pelo nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 2,
            padding: "14px 16px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)" /* Fundinho preto 60% */,
            color: "#fff",
            border:
              "1px solid rgba(0, 196, 204, 0.4)" /* Bordinha ciano suave */,
            outline: "none",
            fontSize: "15px",
          }}
        />

        {/* Caixa de seleção de Paiol */}
        <select
          value={filtroLocal}
          onChange={(e) => setFiltroLocal(e.target.value)}
          style={{
            flex: 1,
            padding: "14px 16px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6)" /* Fundinho preto 60% */,
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            outline: "none",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          <option value="Todos">Todos os Estoques</option>
          <option value="Paiol Central">Paiol Central</option>
          <option value="Paiol de Elétrica">Paiol de Elétrica</option>
          <option value="Paiol de Mecânica">Paiol de Mecânica</option>
          <option value="Paiol de Segurança (EPIs)">
            Paiol de Segurança (EPIs)
          </option>
        </select>
      </div>

      {/* Tabela de Dados */}
      {/* Usamos borderSpacing para dar um espaço entre as linhas, criando "cards" */}
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
              Cód
            </th>
            <th
              style={{
                padding: "0 16px 8px 16px",
                color: "#00C4CC",
                fontSize: "14px",
              }}
            >
              Descrição
            </th>
            <th
              style={{
                padding: "0 16px 8px 16px",
                color: "#00C4CC",
                fontSize: "14px",
              }}
            >
              Estoque
            </th>
            <th
              style={{
                padding: "0 16px 8px 16px",
                color: "#00C4CC",
                fontSize: "14px",
              }}
            >
              Localização
            </th>
            <th
              style={{
                padding: "0 16px 8px 16px",
                color: "#00C4CC",
                fontSize: "14px",
              }}
            >
              Tipo
            </th>
          </tr>
        </thead>
        <tbody>
          {itensFiltrados.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "30px",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  borderRadius: "8px",
                  color: "#aaa",
                }}
              >
                Nenhuma ferramenta encontrada no estoque.
              </td>
            </tr>
          ) : (
            itensFiltrados.map((item) => (
              <tr
                key={item.id}
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
              >
                {/* As bordas arredondadas ficam no primeiro e último <td> para criar a cápsula */}
                <td
                  style={{
                    padding: "16px",
                    borderRadius: "8px 0 0 8px",
                    color: "#aaa",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  #{item.id}
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
                  {item.nome}
                </td>
                <td
                  style={{
                    padding: "16px",
                    color: "#fff",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {item.quantidade} un
                </td>
                <td
                  style={{
                    padding: "16px",
                    color: "#ddd",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {item.localizacao}
                </td>
                <td
                  style={{
                    padding: "16px",
                    borderRadius: "0 8px 8px 0",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius:
                        "20px" /* Tag bem arredondada, padrão premium */,
                      fontSize: "12px",
                      fontWeight: "bold",
                      /* Cores da tag baseadas no tipo de ferramenta */
                      backgroundColor: item.retornavel
                        ? "rgba(251, 169, 76, 0.15)"
                        : "rgba(74, 222, 128, 0.15)",
                      color: item.retornavel ? "#fba94c" : "#4ade80",
                      border: item.retornavel
                        ? "1px solid rgba(251, 169, 76, 0.4)"
                        : "1px solid rgba(74, 222, 128, 0.4)",
                    }}
                  >
                    {item.retornavel ? "Retornável" : "Consumível"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ConsultaEstoque;
