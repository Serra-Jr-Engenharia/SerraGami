'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function loginRH(formData: FormData) {
  const password = formData.get('password') as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('rh_auth', 'true', { httpOnly: true, path: '/' });
    redirect('/pontuar');
  } else {
    return { error: 'Senha incorreta. Verifique se o servidor foi reiniciado para ler o .env' };
  }
}

export async function updateMemberPokemon(memberName: string, pokemonFamilyId: number | null) {
  const { getNotionMembers } = await import('@/lib/notion');
  const notionMembers = await getNotionMembers();
  const memberData = notionMembers.find(m => m.name === memberName) || { name: memberName, sector: 'Geral' };

  await prisma.member.upsert({
    where: { name: memberName },
    update: { pokemonFamily: pokemonFamilyId },
    create: {
      name: memberName,
      sector: memberData.sector,
      pokemonFamily: pokemonFamilyId
    }
  });

  revalidatePath('/');
  revalidatePath('/pontuar/pokemons');
}

export async function addMultiplePoints(memberName: string, entries: Array<{ category: string, points: number, description: string }>) {
  if (!memberName || entries.length === 0) {
    throw new Error('Dados incompletos');
  }

  // Pega todos do notion para sabermos o setor
  const { getNotionMembers } = await import('@/lib/notion');
  const notionMembers = await getNotionMembers();
  const memberData = notionMembers.find(m => m.name === memberName) || { name: memberName, sector: 'Geral' };

  // Calculate total points to increment
  const totalPoints = entries.reduce((sum, entry) => sum + entry.points, 0);

  await prisma.$transaction(async (tx) => {
    // Upsert the member with the total points increment
    const member = await tx.member.upsert({
      where: { name: memberName },
      update: {
        points: { increment: totalPoints }
      },
      create: {
        name: memberName,
        sector: memberData.sector,
        points: totalPoints
      }
    });

    // Create all transactions
    await tx.transaction.createMany({
      data: entries.map(entry => ({
        points: entry.points,
        description: entry.description,
        category: entry.category,
        memberId: member.id,
      }))
    });
  });

  revalidatePath('/');
  redirect('/');
}
