import { useState } from 'react';
import { cadastrarItem } from './services/estoqueService';

function NovaFerramenta() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [retornavel, setRetornavel] = useState('nao');
  const [localizacao, setLocalizacao] = useState('Paiol Central');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantidade <= 0) return alert('A quantidade deve ser maior que zero.');

    try {
      const { resposta } = await cadastrarItem({
        nome,
        quantidade: parseInt(quantidade),
        retornavel: retornavel === 'sim',
        localizacao
      });

      if (resposta.ok) {
        alert(`✅ ${nome} cadastrado com sucesso no banco de dados!`);
        setNome(''); setQuantidade('');
      } else {
        alert("Erro ao cadastrar ferramenta.");
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <section className="module-section form-section">
      <div className="module-heading">
        <span className="module-kicker">Cadastro</span>
        <h2>Cadastrar Novo Material</h2>
      </div>
      <form className="module-form" onSubmit={handleSubmit}>
        <input className="field-control" type="text" placeholder="Nome da ferramenta ou material" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input className="field-control" type="number" placeholder="Quantidade inicial" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        <select className="field-control" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)}>
          <option value="Paiol Central">Paiol Central (Geral)</option>
          <option value="Paiol de Elétrica">Paiol de Elétrica</option>
          <option value="Paiol de Mecânica">Paiol de Mecânica</option>
          <option value="Paiol de Segurança (EPIs)">Paiol de Segurança (EPIs)</option>
        </select>
        <select className="field-control" value={retornavel} onChange={(e) => setRetornavel(e.target.value)}>
          <option value="nao">Consumível (Não retorna)</option>
          <option value="sim">Ativo Retornável (Ex: Furadeira)</option>
        </select>
        <button type="submit" className="primary-action">Salvar Material</button>
      </form>
    </section>
  );
}
export default NovaFerramenta;
