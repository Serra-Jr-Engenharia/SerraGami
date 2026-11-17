import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_SECRET_KEY || '',
});

// A string temporária abaixo deve ser substituída pelo seu DATABASE_ID de membros
export const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export async function getNotionMembers() {
  if (!DATABASE_ID) return [];

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    const members = response.results.map((page: any) => {
      // Pega o nome (coluna title)
      const nameProp = page.properties.Nome || Object.values(page.properties).find((p: any) => p.type === 'title');
      const name = nameProp?.title?.[0]?.plain_text || "Sem Nome";
      
      // Pega a assessoria (coluna Assessoria)
      const assessoriaProp = page.properties.Assessoria || page.properties.Setor;
      let sector = "Geral";
      
      if (assessoriaProp) {
        if (assessoriaProp.type === 'multi_select' && assessoriaProp.multi_select.length > 0) {
          sector = assessoriaProp.multi_select[0].name;
        } else if (assessoriaProp.type === 'select' && assessoriaProp.select) {
          sector = assessoriaProp.select.name;
        } else if (assessoriaProp.type === 'rich_text' && assessoriaProp.rich_text.length > 0) {
          sector = assessoriaProp.rich_text[0].plain_text;
        }
      }

      return { name, sector };
    });

    // Remove duplicatas e membros da Diretoria, Presidência, etc
    const excludedRoles = [
      'diretoria',
      'presidência',
      'presidencia',
      'vice presidência',
      'vice presidencia',
      'professora orientadora',
      'professor orientador',
      'conselheiro',
      'conselheira'
    ];

    const validMembers = members.filter(item => {
      const sectorLower = item.sector.toLowerCase();
      // Checa se o setor inclui alguma das palavras excluídas
      return !excludedRoles.some(role => sectorLower.includes(role));
    });

    const uniqueMembers = Array.from(new Map(validMembers.map(item => [item.name, item])).values());
    
    return uniqueMembers;
  } catch (error) {
    console.error('Erro ao buscar membros no Notion:', error);
    return [];
  }
}
