'use client';

import { useState } from 'react';
import { loginRH } from '../actions';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await loginRH(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      // ignore, redirect throws an error internally in Next.js
    }
  };

  return (
    <main className="container flex items-center justify-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card glass-panel flex flex-col gap-6" style={{ width: '100%', maxWidth: '400px' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Acesso Restrito</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Faça login para gerenciar a gamificação.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" style={{ color: 'var(--text-secondary)' }}>Senha do RH</label>
            <input type="password" name="password" id="password" className="input" required placeholder="Digite a senha..." />
            {error && <p style={{ color: 'var(--tier-fenix)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Verificando...' : 'Acessar Painel'}
          </button>
        </form>

        <Link href="/" style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem', textDecoration: 'none' }}>
          Voltar para Home
        </Link>
      </div>
    </main>
  );
}
