// src/TrocarSenhaModal.jsx
import { useState } from 'react';
import { atualizarPrimeiraSenha } from './services/usuariosService';

function TrocarSenhaModal({ usuario, aoConcluir }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Checa se as senhas batem
    if (novaSenha !== confirmacao) {
      return alert('As senhas digitadas não conferem.');
    }

    // ✨ 2. REGRA DE NEGÓCIO DO RYCHARD: VALIDAÇÃO DE SENHA FORTE
    const regexSenhaForte = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (!regexSenhaForte.test(novaSenha)) {
      return alert('⚠️ ATENÇÃO: A senha é muito fraca!\n\nPara a segurança da plataforma, ela deve conter:\n- Pelo menos 8 caracteres\n- Pelo menos 1 letra MAIÚSCULA\n- Pelo menos 1 número');
    }

    setSalvando(true);

    try {
      const { resposta, dados } = await atualizarPrimeiraSenha(usuario.id, novaSenha);

      if (resposta.ok) {
        alert('Senha atualizada com sucesso! Bem-vindo(a).');
        aoConcluir();
      } else {
        alert(dados.erro);
      }
    } catch {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="password-modal-backdrop">
      <div className="password-modal">
        <div className="module-heading">
          <span className="module-kicker">Primeiro acesso</span>
          <h2>Crie sua nova senha</h2>
          <p>Antes de continuar, substitua a senha provisória por uma senha pessoal e segura.</p>
        </div>

        <form className="module-form" onSubmit={handleSubmit}>
          <input
            className="field-control"
            type="password"
            placeholder="Nova senha forte"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <input
            className="field-control"
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />
          <button type="submit" className="primary-action" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TrocarSenhaModal;