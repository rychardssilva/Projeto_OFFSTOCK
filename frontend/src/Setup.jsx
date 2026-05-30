// src/Setup.jsx
import { useState } from 'react';
import './Setup.css'; // Agora ela tem o próprio arquivo de estilo!
import { configurarPrimeiroAdmin } from './services/authService';

function Setup({ irParaLogin }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSetup = async (e) => {
    e.preventDefault();
    
    try {
      const { resposta, dados } = await configurarPrimeiroAdmin({ nome, cpf, email, senha });

      if (resposta.ok) {
        alert("✅ Sistema configurado! Faça o login com seus novos dados.");
        irParaLogin();
      } else {
        alert("❌ Erro: " + dados.erro);
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        
        <div className="setup-header">
          <h1>Offstock</h1>
          <p>Configuração Inicial do Sistema</p>
          <span className="setup-subtitle">Crie a credencial de Super Administrador</span>
        </div>
        
        <form className="setup-form" onSubmit={handleSetup}>
          <div className="setup-input-group">
            <input type="text" placeholder="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="setup-input-group">
            <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
          </div>
          <div className="setup-input-group">
            <input type="email" placeholder="E-mail corporativo" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="setup-input-group">
            <input type="password" placeholder="Crie uma senha forte" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn-setup">Finalizar Instalação</button>
        </form>

      </div>
    </div>
  );
}

export default Setup;
