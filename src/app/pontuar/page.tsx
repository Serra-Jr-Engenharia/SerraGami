import { prisma } from '@/lib/prisma';
import { getNotionMembers } from '@/lib/notion';
import Link from 'next/link';
import PontuarForm from './PontuarForm';

export default async function PontuarPage() {
  const notionMembers = await getNotionMembers();
  const dbMembers = await prisma.member.findMany({ orderBy: { name: 'asc' } });
  
  const members = notionMembers.length > 0 ? notionMembers : dbMembers;

  return (
    <div className="card glass-panel">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Registrar Novas Pontuações</h3>
      <PontuarForm members={members} />
    </div>
  );
}
