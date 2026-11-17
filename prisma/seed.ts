import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.member.createMany({
    data: [
      { name: 'João Silva', sector: 'Mecânica', points: 45 },
      { name: 'Maria Souza', sector: 'RH', points: 20 },
      { name: 'Pedro Costa', sector: 'Computação', points: 10 },
      { name: 'Ana Lima', sector: 'Marketing', points: 42 },
      { name: 'Lucas Gomes', sector: 'Comercial', points: 5 },
      { name: 'Julia Reis', sector: 'Serralab', points: 30 },
    ],
  })

  console.log('Seed completo!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
