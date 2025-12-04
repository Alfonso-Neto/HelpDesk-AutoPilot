export class TicketClassifier {
  classify(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (this.isNetworkIssue(lowerDesc)) {
      return 'Rede/Conexão';
    } else if (this.isHardwareIssue(lowerDesc)) {
      return 'Hardware';
    } else if (this.isSoftwareIssue(lowerDesc)) {
      return 'Software/Aplicação';
    } else if (this.isAccessIssue(lowerDesc)) {
      return 'Acesso/Senha';
    } else if (this.isEmailIssue(lowerDesc)) {
      return 'Email';
    } else {
      return 'Geral';
    }
  }

  private isNetworkIssue(desc: string): boolean {
    const keywords = ['internet', 'wifi', 'rede', 'conexão', 'conectar', 'desconecta', 'lento', 'velocidade'];
    return keywords.some(k => desc.includes(k));
  }

  private isHardwareIssue(desc: string): boolean {
    const keywords = ['computador', 'mouse', 'teclado', 'monitor', 'impressora', 'não liga', 'quebrado', 'tela'];
    return keywords.some(k => desc.includes(k));
  }

  private isSoftwareIssue(desc: string): boolean {
    const keywords = ['aplicativo', 'programa', 'software', 'sistema', 'erro', 'trava', 'fecha', 'não abre'];
    return keywords.some(k => desc.includes(k));
  }

  private isAccessIssue(desc: string): boolean {
    const keywords = ['senha', 'login', 'acesso', 'bloqueado', 'não consigo entrar', 'esqueci'];
    return keywords.some(k => desc.includes(k));
  }

  private isEmailIssue(desc: string): boolean {
    const keywords = ['email', 'e-mail', 'outlook', 'mensagem', 'não recebo', 'não envia'];
    return keywords.some(k => desc.includes(k));
  }
}
