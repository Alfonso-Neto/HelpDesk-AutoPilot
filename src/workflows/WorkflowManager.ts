import * as readline from 'readline';
import { PasswordResetWorkflow } from './PasswordResetWorkflow.js';
import { CreateTicketWorkflow } from './CreateTicketWorkflow.js';
import { NotionTicketWorkflow } from './NotionTicketWorkflow.js';

export class WorkflowManager {
  private rl: readline.Interface;

  constructor(rl: readline.Interface) {
    this.rl = rl;
  }

  async showMenu(): Promise<void> {
    console.log('\n=== Workflows Disponíveis ===');
    console.log('1. Reset Automático de Senha');
    console.log('2. Criar Ticket no Supabase');
    console.log('3. Criar Ticket no Notion');
    console.log('4. Listar Tickets (Supabase)');
    console.log('5. Listar Tickets (Notion)');
    console.log('0. Voltar ao diagnóstico\n');

    const choice = await this.askChoice();

    switch (choice) {
      case '1':
        await this.executePasswordReset();
        break;
      case '2':
        await this.executeCreateTicket();
        break;
      case '3':
        await this.executeCreateNotionTicket();
        break;
      case '4':
        await this.executeListTickets();
        break;
      case '5':
        await this.executeListNotionTickets();
        break;
      case '0':
        console.log('Voltando...\n');
        break;
      default:
        console.log('Opção inválida.\n');
    }
  }

  private askChoice(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question('Escolha uma opção: ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async executePasswordReset(): Promise<void> {
    const workflow = new PasswordResetWorkflow(this.rl);
    await workflow.execute();
  }

  private async executeCreateTicket(): Promise<void> {
    try {
      const workflow = new CreateTicketWorkflow(this.rl);
      
      const title = await this.ask('Título do ticket: ');
      const description = await this.ask('Descrição do problema: ');
      const category = await this.ask('Categoria (Rede/Hardware/Software/Acesso/Geral): ');
      const urgency = await this.ask('Urgência (Baixa/Média/Alta/Crítica): ');

      await workflow.execute({
        title,
        description,
        category,
        urgency
      });
    } catch (error) {
      console.error('Erro ao criar ticket:', error instanceof Error ? error.message : error);
    }
  }

  private async executeCreateNotionTicket(): Promise<void> {
    try {
      const workflow = new NotionTicketWorkflow(this.rl);
      
      const title = await this.ask('Título do ticket: ');
      const description = await this.ask('Descrição do problema: ');
      const category = await this.ask('Categoria (Rede/Hardware/Software/Acesso/Geral): ');
      const urgency = await this.ask('Urgência (Baixa/Média/Alta/Crítica): ');

      await workflow.execute({
        title,
        description,
        category,
        urgency
      });
    } catch (error) {
      console.error('Erro ao criar ticket no Notion:', error instanceof Error ? error.message : error);
    }
  }

  private async executeListTickets(): Promise<void> {
    try {
      const workflow = new CreateTicketWorkflow(this.rl);
      const email = await this.ask('Email do usuário (deixe vazio para ver todos): ');
      await workflow.listTickets(email || undefined);
    } catch (error) {
      console.error('Erro ao listar tickets:', error instanceof Error ? error.message : error);
    }
  }

  private async executeListNotionTickets(): Promise<void> {
    try {
      const workflow = new NotionTicketWorkflow(this.rl);
      const email = await this.ask('Email do usuário (deixe vazio para ver todos): ');
      await workflow.listTickets(email || undefined);
    } catch (error) {
      console.error('Erro ao listar tickets no Notion:', error instanceof Error ? error.message : error);
    }
  }

  private ask(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}
