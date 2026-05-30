// src/Cadastro.jsx
import { useState } from "react";
import "./Login.css"; // Podemos reaproveitar o mesmo CSS para manter o padrão!
import { cadastrarOperador } from "./services/usuariosService";

function Cadastro({ irParaLogin }) {
  const [formulario, setFormulario] = useState({
    nome: "",
    cpf: "",
    area_trabalho: "",
    idade: "",
    email: "",
    celular: "",
    senha: "",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Enviando os dados para o nosso backend Node.js
    const { resposta, dados } = await cadastrarOperador(formulario);

    if (resposta.ok) {
      alert("Cadastro realizado com sucesso! Faça seu login.");
      irParaLogin(); // Volta para a tela de login
    } else {
      alert(dados.erro);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card cadastro-card">
        <h1>Novo Operador</h1>
        <p>Cadastro de acesso ao Offstock</p>

        <form className="login-form" onSubmit={handleCadastro}>
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="area_trabalho"
            placeholder="Área de Trabalho (ex: Manutenção)"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="idade"
            placeholder="Idade"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="celular"
            placeholder="Celular"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="senha"
            placeholder="Crie uma Senha"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-acessar">
            Cadastrar
          </button>
          <button type="button" onClick={irParaLogin} className="btn-admin">
            Já tenho conta (Voltar)
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;
