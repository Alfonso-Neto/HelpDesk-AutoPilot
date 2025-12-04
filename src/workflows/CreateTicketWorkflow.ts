import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as readline from 'readline';

interface TicketData {
  title: string;
  description: string;
  category: string;
  urgency: string;
  user_email: string;
  status: string;
  created_at: string;
}

export class CreateTicketWorkflow {
  private supabase: SupabaseClient;
  private rl: readline.Interface;

  constructor(rl: readline.Interface) {
    this.rl = rl;
    
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Configuração do Supabase não encontrada. Configure SUPABASE_URL e SUPABASE_KEY no .env');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async execute(ticketData: Partial<TicketData>): Promise<void> {
    console.log('\n=== Criando Ticket no Supabase ===\n');

    const email = await this.askEmail();
    
    const ticket: TicketData = {
      title: ticketData.title || 'Ticket de Suporte',
      description: ticketData.description || '',
      category: ticketData.category || 'Geral',
      urgency: ticketData.urgency || 'Média',
      user_email: email,
      status: 'Aberto',
      created_at: new Date().toISOString()
    };

    console.log('\nSalvando ticket...');
    
    const result = await this.saveTicket(ticket);

    if (result.success) {
      console.log('\n✅ Ticket criado com sucesso!');
      console.log(`\nID do Ticket: ${result.ticketId}`);
      console.log(`Email: ${ticket.user_email}`);
      console.log(`Categoria: ${ticket.category}`);
      console.log(`Urgência: ${ticket.urgency}`);
      console.log('\nVocê receberá atualizações por email.');
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

  private async saveTicket(ticket: TicketData): Promise<{ success: boolean; ticketId?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('tickets')
        .insert([ticket])
        .select('id')
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        return { success: false, error: error.message };
      }

      return { success: true, ticketId: data?.id };
    } catch (error) {
      console.error('Erro ao salvar ticket:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  async listTickets(userEmail?: string): Promise<void> {
    console.log('\n=== Consultando Tickets ===\n');

    try {
      let query = this.supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (userEmail) {
        query = query.eq('user_email', userEmail);
      }

      const { data, error } = await query.limit(10);

      if (error) {
        console.log('❌ Erro ao consultar tickets:', error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.log('Nenhum ticket encontrado.');
        return;
      }

      console.log(`Encontrados ${data.length} ticket(s):\n`);
      data.forEach((ticket: any) => {
        console.log(`ID: ${ticket.id}`);
        console.log(`Título: ${ticket.title}`);
        console.log(`Status: ${ticket.status}`);
        console.log(`Urgência: ${ticket.urgency}`);
        console.log(`Criado em: ${new Date(ticket.created_at).toLocaleString('pt-BR')}`);
        console.log('---');
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  }
}
