import * as readline from 'readline';
import { TicketClassifier } from './TicketClassifier.js';
import { UrgencyChecker } from './UrgencyChecker.js';
import { DiagnosticEngine } from './DiagnosticEngine.js';
import { WorkflowManager } from '../workflows/WorkflowManager.js';

interface Ticket {
  id: string;
  description: string;
  answers: string[];
  classification?: string;
  urgency?: string;
  diagnosis?: string;
}

export class HelpDeskAgent {
  private rl: readline.Interface;
  private classifier: TicketClassifier;
  private urgencyChecker: UrgencyChecker;
  private diagnosticEngine: DiagnosticEngine;
  private workflowManager: WorkflowManager;
  private currentTicket: Ticket | null = null;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.classifier = new TicketClassifier();
    this.urgencyChecker = new UrgencyChecker();
    this.diagnosticEngine = new DiagnosticEngine();
    this.workflowManager = new WorkflowManager(this.rl);
  }

  start(): void {
    console.log('Olá! Sou o assistente de Suporte Nível 1.');
    console.log('Vou ajudá-lo a resolver seu problema.\n');
    this.askForProblem();
  }

  private askForProblem(): void {
    this.rl.question('Descreva o problema que está enfrentando: ', (answer) => {
      this.currentTicket = {
        id: this.generateTicketId(),
        description: answer,
        answers: []
      };
      
      this.classifyAndCheckUrgency();
    });
  }

  private classifyAndCheckUrgency(): void {
    if (!this.currentTicket) return;

    this.currentTicket.classification = this.classifier.classify(this.currentTicket.description);
    this.currentTicket.urgency = this.urgencyChecker.check(this.currentTicket.description);

    console.log(`\n[Ticket #${this.currentTicket.id}]`);
    console.log(`Categoria: ${this.currentTicket.classification}`);
    console.log(`Urgência: ${this.currentTicket.urgency}\n`);

    this.askEssentialQuestions();
  }

  private askEssentialQuestions(): void {
    const questions = this.getEssentialQuestions();
    this.askQuestion(questions, 0);
  }

  private getEssentialQuestions(): string[] {
    if (!this.currentTicket) return [];

    const classification = this.currentTicket.classification || '';
    
    if (classification.includes('Rede') || classification.includes('Conexão')) {
      return [
        'Quando o problema começou? (hoje, ontem, há uma semana)',
        'Outros dispositivos estão com o mesmo problema?',
        'Você já tentou reiniciar o equipamento?'
      ];
    } else if (classification.includes('Software') || classification.includes('Aplicação')) {
      return [
        'Qual aplicativo está apresentando o problema?',
        'Você recebe alguma mensagem de erro? Se sim, qual?',
        'O problema acontece sempre ou só às vezes?'
      ];
    } else if (classification.includes('Hardware')) {
      return [
        'Qual equipamento está com problema?',
        'Houve alguma queda ou dano físico recente?',
        'O equipamento liga normalmente?'
      ];
    } else {
      return [
        'Quando você notou o problema pela primeira vez?',
        'O problema afeta seu trabalho neste momento?',
        'Você já tentou alguma solução? Se sim, qual?'
      ];
    }
  }

  private askQuestion(questions: string[], index: number): void {
    if (index >= questions.length) {
      this.provideDiagnosis().catch(console.error);
      return;
    }

    this.rl.question(`${index + 1}. ${questions[index]}\n> `, (answer) => {
      this.currentTicket?.answers.push(answer);
      this.askQuestion(questions, index + 1);
    });
  }

  private async provideDiagnosis(): Promise<void> {
    if (!this.currentTicket) return;

    console.log('\n--- Análise do Problema ---\n');
    
    const diagnosis = this.diagnosticEngine.diagnose(
      this.currentTicket.description,
      this.currentTicket.answers,
      this.currentTicket.classification || ''
    );

    this.currentTicket.diagnosis = diagnosis.summary;

    console.log(diagnosis.summary);
    console.log('\nPróximos passos:');
    diagnosis.steps.forEach((step: string, i: number) => {
      console.log(`${i + 1}. ${step}`);
    });

    if (diagnosis.escalate) {
      console.log('\n⚠️  Este caso será encaminhado para o Suporte Nível 2.');
      console.log('Motivo: ' + diagnosis.escalationReason);
    }

    // Detecta automaticamente se precisa de ações específicas
    await this.suggestActions();
  }

  private async suggestActions(): Promise<void> {
    if (!this.currentTicket) return;

    const classification = this.currentTicket.classification || '';
    const description = this.currentTicket.description.toLowerCase();

    // Detecta se é problema de senha
    if (classification.includes('Acesso') || description.includes('senha') || description.includes('login')) {
      console.log('\n💡 Posso resetar sua senha agora mesmo.');
      this.rl.question('Deseja que eu faça o reset da senha? (s/n): ', async (answer) => {
        if (answer.toLowerCase() === 's') {
          const { PasswordResetWorkflow } = await import('../workflows/PasswordResetWorkflow.js');
          const workflow = new PasswordResetWorkflow(this.rl);
          await workflow.execute();
        }
        await this.offerTicketCreation();
      });
    } else {
      await this.offerTicketCreation();
    }
  }

  private async offerTicketCreation(): Promise<void> {
    if (!this.currentTicket) {
      this.rl.close();
      return;
    }

    console.log('\n📝 Registrando este atendimento automaticamente...');
    
    const email = await this.askEmail();
    
    let notionSuccess = false;
    let supabaseSuccess = false;

    // Tenta salvar no Notion
    try {
      await this.createNotionTicket(email);
      notionSuccess = true;
      console.log('✅ Ticket registrado no Notion');
    } catch (error) {
      console.log('⚠️  Não foi possível salvar no Notion');
    }

    // Tenta salvar no Supabase
    try {
      await this.createSupabaseTicket(email);
      supabaseSuccess = true;
      console.log('✅ Ticket registrado no Supabase');
    } catch (error) {
      console.log('⚠️  Não foi possível salvar no Supabase');
    }

    if (this.currentTicket) {
      console.log(`\n✅ Atendimento finalizado! Ticket #${this.currentTicket.id}`);
    }
    console.log('Obrigado por entrar em contato. Até logo!\n');
    this.rl.close();
  }

  private async createNotionTicket(email: string): Promise<void> {
    if (!this.currentTicket) return;

    const { NotionTicketWorkflow } = await import('../workflows/NotionTicketWorkflow.js');
    const workflow = new NotionTicketWorkflow(this.rl);
    
    await workflow.execute({
      title: `[${this.currentTicket.classification}] ${this.currentTicket.description.substring(0, 50)}`,
      description: this.currentTicket.description,
      category: this.currentTicket.classification || 'Geral',
      urgency: this.extractUrgencyLevel(this.currentTicket.urgency || ''),
      userEmail: email
    });
  }

  private async createSupabaseTicket(email: string): Promise<void> {
    if (!this.currentTicket) return;

    const { CreateTicketWorkflow } = await import('../workflows/CreateTicketWorkflow.js');
    const workflow = new CreateTicketWorkflow(this.rl);
    
    await workflow.execute({
      title: `[${this.currentTicket.classification}] ${this.currentTicket.description.substring(0, 50)}`,
      description: this.currentTicket.description,
      category: this.currentTicket.classification || 'Geral',
      urgency: this.extractUrgencyLevel(this.currentTicket.urgency || ''),
      user_email: email
    });
  }

  private askEmail(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question('Seu email para acompanhamento: ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private extractUrgencyLevel(urgency: string): string {
    if (urgency.includes('CRÍTICA')) return 'Crítica';
    if (urgency.includes('ALTA')) return 'Alta';
    if (urgency.includes('MÉDIA')) return 'Média';
    return 'Baixa';
  }

  private generateTicketId(): string {
    return 'TK' + Date.now().toString().slice(-8);
  }
}
