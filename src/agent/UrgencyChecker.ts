export class UrgencyChecker {
  check(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (this.isCritical(lowerDesc)) {
      return '🔴 CRÍTICA';
    } else if (this.isHigh(lowerDesc)) {
      return '🟠 ALTA';
    } else if (this.isMedium(lowerDesc)) {
      return '🟡 MÉDIA';
    } else {
      return '🟢 BAIXA';
    }
  }

  private isCritical(desc: string): boolean {
    const keywords = [
      'não consigo trabalhar',
      'sistema parado',
      'produção parada',
      'urgente',
      'crítico',
      'todos os usuários',
      'empresa toda'
    ];
    return keywords.some(k => desc.includes(k));
  }

  private isHigh(desc: string): boolean {
    const keywords = [
      'não funciona',
      'não liga',
      'perdeu dados',
      'não acessa',
      'bloqueado',
      'preciso urgente'
    ];
    return keywords.some(k => desc.includes(k));
  }

  private isMedium(desc: string): boolean {
    const keywords = [
      'lento',
      'às vezes',
      'demora',
      'travando',
      'problema intermitente'
    ];
    return keywords.some(k => desc.includes(k));
  }
}
