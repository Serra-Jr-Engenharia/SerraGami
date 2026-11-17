import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PontuarLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('rh_auth')?.value === 'true';

  if (!isAuth) {
    redirect('/login');
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h2>Área Restrita (RH)</h2>
        <Link href="/" className="btn" style={{ textDecoration: 'none' }}>Voltar para Home</Link>
      </header>
      
      <nav className="flex gap-4" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <Link href="/pontuar" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
          Registrar Pontuações
        </Link>
        <Link href="/pontuar/pokemons" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
          Editar Pokémons
        </Link>
      </nav>

      {children}
    </div>
  );
}
