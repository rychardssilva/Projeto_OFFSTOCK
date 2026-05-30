import { useState, useEffect } from 'react';
import { buscarItens } from './services/estoqueService';
import { buscarOperadores } from './services/usuariosService';
import { registrarRetirada } from './services/movimentacaoService';

function RegistrarRetirada() {
  const [estoque, setEstoque] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [ferramentaId, setFerramentaId] = useState('');
  const [operadorId, setOperadorId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');

  // Carrega as ferramentas e os operadores reais do banco para o select
  useEffect(() => {
    buscarItens().then(data => setEstoque(data));
    buscarOperadores().then(data => setOperadores(data));
  }, []);

  const handleRetirada = async (e) => {
    e.preventDefault();
    if (quantidade <= 0) return alert('A quantidade deve ser maior que zero.');

    try {
      const { resposta, dados } = await registrarRetirada({ ferramentaId, operadorId, quantidade, dataPrevista });
      if (resposta.ok) {
        alert('✅ Saída registrada e estoque atualizado!');
        setFerramentaId(''); setOperadorId(''); setQuantidade(''); setDataPrevista('');
      } else {
        alert(`❌ Erro: ${dados.erro}`); // Ex: Avisa se o estoque for insuficiente
      }
    } catch {
      alert("Erro ao conectar com o banco de dados.");
    }
  };

  return (
    <section className="module-section form-section">
      <div className="module-heading">
        <span className="module-kicker">Movimentacao</span>
        <h2>Registrar Saida de Material</h2>
      </div>
      <form className="module-form" onSubmit={handleRetirada}>
        <select className="field-control" value={ferramentaId} onChange={(e) => setFerramentaId(e.target.value)} required>
          <option value="" disabled>Selecione a Ferramenta / Material...</option>
          {estoque.map(item => (
            <option key={item.id} value={item.id}>#{item.id} - {item.nome} (Estoque atual: {item.quantidade})</option>
          ))}
        </select>
        
        <select className="field-control" value={operadorId} onChange={(e) => setOperadorId(e.target.value)} required>
          <option value="" disabled>Selecione o Operador Solicitante...</option>
          {operadores.map(op => (
            <option key={op.id} value={op.id}>{op.nome} - CPF: {op.cpf}</option>
          ))}
        </select>
        
        <input className="field-control" type="number" placeholder="Quantidade solicitada" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
        
        <div className="field-group">
          <label>Data prevista de devolucao</label>
          <input className="field-control" type="date" value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} />
        </div>
        <button type="submit" className="primary-action">Autorizar Retirada</button>
      </form>
    </section>
  );
}
export default RegistrarRetirada;
