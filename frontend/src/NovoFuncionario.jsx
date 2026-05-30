import { useState } from 'react';
import { cadastrarOperador } from './services/usuariosService';

function NovoFuncionario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [setor, setSetor] = useState('Manutenção Geral');

  const handleCadastroUser = async (e) => {
    e.preventDefault();
    
    try {
      const { resposta } = await cadastrarOperador({ nome, cpf, email, area_trabalho: setor, senha: 'mudar123', idade: 0, celular: '' });
      if (resposta.ok) {
        alert(`✅ Operador ${nome} cadastrado! A senha padrão dele é: mudar123`);
        setNome(''); setCpf(''); setEmail('');
      } else {
        alert("Erro. CPF ou Email já podem estar em uso.");
      }
    } catch {
      alert("Erro ao conectar com o banco de dados.");
    }
  };

  return (
    <section className="module-section form-section warning-section">
      <div className="module-heading">
        <span className="module-kicker">Equipe</span>
        <h2>Cadastrar Novo Operador</h2>
        <p>O funcionario cadastrado tera acesso apenas a visualizacao do estoque.</p>
      </div>
      <form className="module-form" onSubmit={handleCadastroUser}>
        <input className="field-control" type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input className="field-control" type="text" placeholder="CPF (apenas numeros)" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
        <input className="field-control" type="email" placeholder="E-mail corporativo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select className="field-control" value={setor} onChange={(e) => setSetor(e.target.value)}>
          <option value="Manutenção Geral">Manutenção Geral</option>
          <option value="Elétrica e Automação">Elétrica e Automação</option>
          <option value="Operação de Convés">Operação de Convés</option>
        </select>
        <button type="submit" className="primary-action warning">Criar Credencial</button>
      </form>
    </section>
  );
}
export default NovoFuncionario;
