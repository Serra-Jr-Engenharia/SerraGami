import { prisma } from '@/lib/prisma';
import { getNotionMembers } from '@/lib/notion';
import { pokemonFamilies } from '@/lib/pokemon';
import PokemonEditor from './PokemonEditor';

export default async function PokemonsPage() {
  const notionMembers = await getNotionMembers();
  const dbMembers = await prisma.member.findMany({ orderBy: { name: 'asc' } });
  
  const membersBase = notionMembers.length > 0 ? notionMembers : dbMembers;
  
  const members = membersBase.map((m) => {
    const dbRecord = dbMembers.find((dbM) => dbM.name === m.name);
    return {
      name: m.name,
      sector: m.sector,
      pokemonFamily: dbRecord?.pokemonFamily ?? null
    };
  });

  return (
    <div className="card glass-panel">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Mudar Pokémons dos Membros</h3>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        O sistema já atribui um Pokémon automaticamente baseado no nome da pessoa. 
        Mas se quiser personalizar, você pode escolher manualmente qual linha evolutiva o membro terá.
      </p>

      <PokemonEditor members={members} pokemonFamilies={pokemonFamilies} />
    </div>
  );
}
