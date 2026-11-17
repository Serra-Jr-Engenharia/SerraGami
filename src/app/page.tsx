import { prisma } from '@/lib/prisma';
import { getNotionMembers } from '@/lib/notion';
import { getPokemonSprite } from '@/lib/pokemon';
import Link from 'next/link';

export default async function Home() {
  // Puxa membros do Notion
  const notionMembers = await getNotionMembers();

  // Puxa pontuações do Prisma
  const dbMembers = await prisma.member.findMany();

  // Se o DATABASE_ID não tiver configurado ainda, caímos pros membros mockados do DB
  const membersBase = notionMembers.length > 0 ? notionMembers : dbMembers;

  // Mescla os dados
  const members = membersBase.map((m) => {
    const dbRecord = dbMembers.find((dbM) => dbM.name === m.name);
    return {
      id: dbRecord?.id || m.name,
      name: m.name,
      sector: m.sector,
      points: dbRecord?.points || 0,
      pokemonFamily: dbRecord?.pokemonFamily ?? null
    };
  }).sort((a, b) => b.points - a.points);
  
  const fenix = members.filter(m => m.points >= 40);
  const incubacao = members.filter(m => m.points >= 16 && m.points < 40);
  const cinza = members.filter(m => m.points < 16);

  return (
    <main className="container animate-fade-in">
      <header className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
        <div>
          <h1>Gamificação Serra Jr</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>A ascensão da Fênix 🦅</p>
        </div>
        <Link href="/pontuar" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Pontuar Membros
        </Link>
      </header>

      {/* Ordem invertida: Cinzas -> Incubação -> Fênix */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Camada Cinzas */}
        <section>
          <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--tier-cinza)' }}></div>
            <h2>Camada Cinzas</h2>
            <span style={{ marginLeft: 'auto', color: 'var(--tier-cinza)' }}>O início (0-15)</span>
          </div>
          <div className="flex flex-col gap-4">
            {cinza.map((m) => (
              <div key={m.id} className="card flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-4">
                  <img src={getPokemonSprite(m.name, m.points, m.pokemonFamily)} alt="Pokemon" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'grayscale(0.5)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{m.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>{m.sector}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--tier-cinza)' }}>{m.points}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>pts</div>
                </div>
              </div>
            ))}
            {cinza.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum membro nesta camada.</p>}
          </div>
        </section>

        {/* Camada Incubação */}
        <section>
          <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--tier-incubacao)', boxShadow: '0 0 10px var(--tier-incubacao)' }}></div>
            <h2>Camada Incubação</h2>
            <span style={{ marginLeft: 'auto', color: 'var(--tier-incubacao)' }}>Evoluindo (16-39)</span>
          </div>
          <div className="flex flex-col gap-4">
            {incubacao.map((m) => (
              <div key={m.id} className="card flex items-center justify-between" style={{ borderColor: 'rgba(245, 175, 25, 0.2)' }}>
                <div className="flex items-center gap-4">
                  <img src={getPokemonSprite(m.name, m.points, m.pokemonFamily)} alt="Pokemon" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{m.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.sector}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--tier-incubacao)' }}>{m.points}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>pts</div>
                </div>
              </div>
            ))}
            {incubacao.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum membro nesta camada ainda.</p>}
          </div>
        </section>

        {/* Camada Fênix */}
        <section>
          <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--tier-fenix)', boxShadow: '0 0 10px var(--tier-fenix)' }}></div>
            <h2>Camada Fênix</h2>
            <span style={{ marginLeft: 'auto', color: 'var(--tier-fenix)' }}>Reis (40+)</span>
          </div>
          <div className="flex flex-col gap-4">
            {fenix.map((m, i) => (
              <div key={m.id} className="card glass-panel flex items-center justify-between" style={{ borderColor: 'rgba(255, 81, 47, 0.3)', boxShadow: '0 4px 20px rgba(255, 81, 47, 0.1)' }}>
                <div className="flex items-center gap-4">
                  <img src={getPokemonSprite(m.name, m.points, m.pokemonFamily)} alt="Pokemon" style={{ width: 64, height: 64, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{m.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.sector}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tier-fenix)' }}>{m.points}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>pts</div>
                </div>
              </div>
            ))}
            {fenix.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum membro nesta camada ainda.</p>}
          </div>
        </section>

      </div>
    </main>
  );
}
