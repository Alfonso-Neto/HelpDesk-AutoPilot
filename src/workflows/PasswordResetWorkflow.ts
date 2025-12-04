import * as readline from 'readline';

interface ResetResult {
  success: boolean;
  message: string;
  newPassword?: string;
}

export class PasswordResetWorkflow {
  private rl: readline.Interface;
  private apiBaseUrl: string;

  constructor(rl: readline.Interface) {
    this.rl = rl;
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  }

  async execute(): Promise<void> {
    console.log('\n=== Reset Automático de Senha ===\n');

    const username = await this.askUsername();
    console.log(`\nBuscando usuário: ${username}...`);

    const userExists = await this.checkUserExists(username);
    
    if (!userExists) {
      console.log('❌ Usuário não encontrado no sistema.');
      return;
    }

    console.log('✓ Usuário encontrado');
    console.log('\nExecutando reset de senha...');

    const result = await this.executeReset(username);

    if (result.success) {
      console.log('\n✅ Senha resetada com sucesso!');
      console.log(`\nNova senha temporária: ${result.newPassword}`);
      console.log('\nInforme ao usuário:');
      console.log('- Use esta senha temporária para fazer login');
      console.log('- Você será solicitado a criar uma nova senha no primeiro acesso');
    } else {
      console.log('\n❌ Erro ao resetar senha: ' + result.message);
      console.log('Este caso será encaminhado para o Suporte Nível 2.');
    }
  }

  private askUsername(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question('Digite o nome de usuário ou email: ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async checkUserExists(username: string): Promise<boolean> {
    try {
      // Simulação de chamada à API
      // Em produção, substituir por: const response = await fetch(`${this.apiBaseUrl}/api/users/${username}`);
      
      // Simulação: aceita qualquer usuário que não seja vazio
      await this.delay(1000);
      return username.length > 0;
    } catch (error) {
      console.error('Erro ao consultar API:', error);
      return false;
    }
  }

  private async executeReset(username: string): Promise<ResetResult> {
    try {
      // Simulação de chamada à API de reset
      // Em produção, substituir por:
      // const response = await fetch(`${this.apiBaseUrl}/api/users/${username}/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      await this.delay(1500);
      
      const tempPassword = this.generateTempPassword();
      
      return {
        success: true,
        message: 'Senha resetada com sucesso',
        newPassword: tempPassword
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
