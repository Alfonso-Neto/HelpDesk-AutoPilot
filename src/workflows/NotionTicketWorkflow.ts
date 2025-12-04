import { Client } from '@notionhq/client';
import * as readline from 'readline';

interface TicketData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  userEmail: string;
}

export class NotionTicketWorkflow {
  private notion: Client;
  private databaseId: string;
  private rl: readline.Interface;

  constructor(rl: readline.Interface) {
    this.rl = rl;
    
    const notionToken = process.env.NOTION_TOKEN || '';
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
    
    if (!notionToken || !this.databaseId) {
      throw new Error('Configure NOTION_TOKEN e NOTION_DATABASE_ID no .env');
    }
    
    this.notion = new Client({ auth: notionToken });
  }

  async execute(ticketData: Partial<TicketData>): Promise<void> {
    console.log('\n=== Criando Ticket no Notion ===\n');

    const email = await this.askEmail();
    
    const ticket: TicketData = {
      title: ticketData.title || 'Ticket de Suporte',
      description: ticketData.description || '',
      category: ticketData.category || 'Geral',
      urgency: ticketData.urgency || 'Média',
      userEmail: email
    };

    console.log('\nCriando página no Notion...');
    
    const result = await this.createNotionPage(ticket);

    if (result.success) {
      console.log('\n✅ Ticket criado com sucesso no Notion!');
      console.log(`\nID do Ticket: ${result.pageId}`);
      console.log(`URL: ${result.url}`);
      console.log(`Email: ${ticket.userEmail}`);
      console.log(`Categoria: ${ticket.category}`);
      console.log(`Urgência: ${ticket.urgency}`);
    } else {
      console.log('\n❌ Erro ao criar ticket: ' + result.error);
    }
  }

  private askEmail(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question('Digite seu email para acompanhamento: ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async createNotionPage(ticket: TicketData): Promise<{ success: boolean; pageId?: string; url?: string; error?: string }> {
    try {
      console.log('Debug - Database ID:', this.databaseId);
      console.log('Debug - Ticket data:', JSON.stringify(ticket, null, 2));

      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Título': {
            title: [
              {
                text: {
                  content: ticket.title
                }
              }
            ]
          },
          'Status': {
            select: {
              name: 'Aberto'
            }
          },
          'Categoria': {
            select: {
              name: ticket.category
            }
          },
          'Urgência': {
            select: {
              name: ticket.urgency
            }
          },
          'Email': {
            email: ticket.userEmail
          },
          'Data de Criação': {
            date: {
              start: new Date().toISOString()
            }
          }
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: ticket.description
                  }
                }
              ]
            }
          }
        ]
      });

      const pageUrl = `https://notion.so/${response.id.replace(/-/g, '')}`;

      return {
        success: true,
        pageId: response.id,
        url: pageUrl
      };
    } catch (error: any) {
      console.error('\n=== ERRO DETALHADO DO NOTION ===');
      console.error('Mensagem:', error.message);
      console.error('Código:', error.code);
      console.error('Status:', error.status);
      if (error.body) {
        console.error('Body:', JSON.stringify(error.body, null, 2));
      }
      console.error('Stack:', error.stack);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  async listTickets(userEmail?: string): Promise<void> {
    console.log('\n=== Consultando Tickets no Notion ===\n');

    try {
      const filter: any = {
        and: []
      };

      if (userEmail) {
        filter.and.push({
          property: 'Email',
          email: {
            equals: userEmail
          }
        });
      }

      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: filter.and.length > 0 ? filter : undefined,
        sorts: [
          {
            property: 'Data de Criação',
            direction: 'descending'
          }
        ],
        page_size: 10
      });

      if (response.results.length === 0) {
        console.log('Nenhum ticket encontrado.');
        return;
      }

      console.log(`Encontrados ${response.results.length} ticket(s):\n`);
      
      response.results.forEach((page: any) => {
        const props = page.properties;
        
        const title = props['Título']?.title?.[0]?.text?.content || 'Sem título';
        const status = props['Status']?.select?.name || 'N/A';
        const urgency = props['Urgência']?.select?.name || 'N/A';
        const created = props['Data de Criação']?.date?.start || '';
        const pageUrl = `https://notion.so/${page.id.replace(/-/g, '')}`;

        console.log(`ID: ${page.id}`);
        console.log(`Título: ${title}`);
        console.log(`Status: ${status}`);
        console.log(`Urgência: ${urgency}`);
        console.log(`Criado em: ${created ? new Date(created).toLocaleString('pt-BR') : 'N/A'}`);
        console.log(`URL: ${pageUrl}`);
        console.log('---');
      });
    } catch (error: any) {
      console.error('Erro ao consultar Notion:', error.message);
    }
  }
}
