'use client';

import { useState } from 'react';
import { addMultiplePoints } from '../actions';

type Member = { name: string; sector: string };

type Entry = {
  id: number;
  category: string;
  points: number | '';
  description: string;
};

export default function PontuarForm({ members }: { members: Member[] }) {
  const [memberId, setMemberId] = useState('');
  const [entries, setEntries] = useState<Entry[]>([{ id: Date.now(), category: '', points: '', description: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now(), category: '', points: '', description: '' }]);
  };

  const removeEntry = (id: number) => {
    if (entries.length === 1) return;
    setEntries(entries.filter((e) => e.id !== id));
  };

  const updateEntry = (id: number, field: keyof Entry, value: string | number) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return alert('Selecione um membro');
    if (entries.some(e => !e.category || e.points === '' || !e.description)) {
      return alert('Preencha todos os campos das pontuações');
    }

    setIsSubmitting(true);
    try {
      const formattedEntries = entries.map(e => ({
        category: e.category,
        points: Number(e.points),
        description: e.description
      }));
      await addMultiplePoints(memberId, formattedEntries);
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar pontuações');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="memberId" style={{ color: 'var(--text-secondary)' }}>Membro</label>
        <select 
          id="memberId" 
          className="input" 
          required 
          style={{ appearance: 'none' }} 
          value={memberId} 
          onChange={(e) => setMemberId(e.target.value)}
        >
          <option value="" disabled>Selecione um membro...</option>
          {members.map((m) => (
            <option key={m.name} value={m.name}>{m.name} - {m.sector}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 style={{ color: 'var(--text-secondary)' }}>Pontuações</h3>
          <button type="button" onClick={addEntry} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
            + Adicionar Linha
          </button>
        </div>

        {entries.map((entry, index) => (
          <div key={entry.id} className="card" style={{ background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
            {entries.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeEntry(entry.id)} 
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                X
              </button>
            )}
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                <div className="flex flex-col gap-2" style={{ flex: 2, minWidth: '200px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Categoria</label>
                  <select 
                    className="input" 
                    required 
                    style={{ appearance: 'none' }} 
                    value={entry.category} 
                    onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                  >
                    <option value="" disabled>Selecione a categoria...</option>
                    <option value="REGRAS_GERAIS">Regras Gerais</option>
                    <option value="CULTURAIS">Culturais e Integração</option>
                    <option value="SETORIAIS_ALTA">Setorial - Alta Prioridade (2 pts)</option>
                    <option value="SETORIAIS_MEDIA">Setorial - Média Prioridade (1 pt)</option>
                    <option value="SETORIAIS_BAIXA">Setorial - Baixa Prioridade (1 pt)</option>
                    <option value="DESCONTO">Desconto de Pontos (Penalidade)</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2" style={{ flex: 1, minWidth: '100px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pontos</label>
                  <input 
                    type="number" 
                    className="input" 
                    required 
                    placeholder="Ex: 3" 
                    value={entry.points}
                    onChange={(e) => updateEntry(entry.id, 'points', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Descrição / Atividade</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  placeholder="Ex: 80% de participação em reuniões..." 
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar Pontuações'}
      </button>
    </form>
  );
}
