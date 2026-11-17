'use client';

import { useState } from 'react';
import { updateMemberPokemon } from '../../actions';

type Member = { name: string; sector: string; pokemonFamily: number | null };
type PokemonFamily = { id: number; name: string; stages: number[] };

export default function PokemonEditor({ members, pokemonFamilies }: { members: Member[], pokemonFamilies: PokemonFamily[] }) {
  const [saving, setSaving] = useState<string | null>(null);

  const handleUpdate = async (memberName: string, familyId: string) => {
    setSaving(memberName);
    try {
      const id = familyId === '' ? null : parseInt(familyId);
      await updateMemberPokemon(memberName, id);
    } catch (err) {
      alert('Erro ao atualizar pokemon');
    }
    setSaving(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {members.map(m => (
        <div key={m.name} className="flex justify-between items-center gap-4 card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem' }}>{m.name}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{m.sector}</p>
          </div>

          <div className="flex items-center gap-4">
            {saving === m.name && <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>Salvando...</span>}
            
            <select 
              className="input" 
              style={{ width: '200px' }} 
              defaultValue={m.pokemonFamily ?? ''}
              onChange={(e) => handleUpdate(m.name, e.target.value)}
            >
              <option value="">(Automático)</option>
              {pokemonFamilies.map(fam => (
                <option key={fam.id} value={fam.id}>{fam.name}</option>
              ))}
            </select>

            {/* Mostra a miniatura do pokemon escolhido */}
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img 
                 src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonFamilies[m.pokemonFamily ?? Math.abs(m.name.split('').reduce((a, b) => a + ((a << 5) - a) + b.charCodeAt(0), 0)) % pokemonFamilies.length].stages[0]}.gif`} 
                 alt="poke" 
                 style={{ width: 36, height: 36, objectFit: 'contain' }} 
               />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
