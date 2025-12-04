interface Diagnosis {
  summary: string;
  steps: string[];
  escalate: boolean;
  escalationReason?: string;
}

export class DiagnosticEngine {
  diagnose(description: string, answers: string[], classification: string): Diagnosis {
    const lowerDesc = description.toLowerCase();
    const lowerAnswers = answers.map(a => a.toLowerCase());

    // Verifica se precisa escalar
    const shouldEscalate = this.shouldEscalate(lowerDesc, lowerAnswers);

    if (shouldEscalate.escalate) {
      return {
        summary: 'Identifiquei que este problema precisa de atenção especializada.',
        steps: ['Aguarde o contato do Suporte Nível 2'],
        escalate: true,
        escalationReason: shouldEscalate.reason
      };
    }

    // Diagnóstico baseado na classificação
    if (classification.includes('Rede')) {
      return this.diagnoseNetwork(lowerAnswers);
    } else if (classification.includes('Hardware')) {
      return this.diagnoseHardware(lowerAnswers);
    } else if (classification.includes('Software')) {
      return this.diagnoseSoftware(lowerAnswers);
    } else if (classification.includes('Acesso')) {
      return this.diagnoseAccess(lowerAnswers);
    } else {
      return this.diagnoseGeneral(lowerAnswers);
    }
  }

  private shouldEscalate(desc: string, answers: string[]): { escalate: boolean; reason?: string } {
    // Problemas complexos
    if (desc.includes('servidor') || desc.includes('banco de dados')) {
      return { escalate: true, reason: 'Problema de infraestrutura' };
    }

    // Já tentou soluções básicas
    const triedMultipleSolutions = answers.some(a => 
      a.includes('já tentei') && (a.includes('tudo') || a.includes('várias'))
    );
    if (triedMultipleSolutions) {
      return { escalate: true, reason: 'Soluções básicas já foram tentadas' };
    }

    // Problema persistente
    const persistent = answers.some(a => 
      a.includes('semana') || a.includes('mês') || a.includes('sempre')
    );
    if (persistent) {
      return { escalate: true, reason: 'Problema persistente que requer análise aprofundada' };
    }

    return { escalate: false };
  }

  private diagnoseNetwork(answers: string[]): Diagnosis {
    return {
      summary: 'Parece ser um problema de conexão. Vamos tentar alguns passos simples.',
      steps: [
        'Reinicie o roteador (desligue por 30 segundos)',
        'Verifique se o cabo de rede está bem conectado',
        'Teste a conexão em outro dispositivo',
        'Se o problema persistir, entre em contato novamente'
      ],
      escalate: false
    };
  }

  private diagnoseHardware(answers: string[]): Diagnosis {
    const notTurningOn = answers.some(a => a.includes('não') && a.includes('liga'));
    
    if (notTurningOn) {
      return {
        summary: 'O equipamento não está ligando. Vamos verificar o básico.',
        steps: [
          'Confirme se o cabo de energia está conectado',
          'Teste em outra tomada',
          'Verifique se há luzes indicadoras acesas',
          'Se nada funcionar, pode ser necessário suporte técnico presencial'
        ],
        escalate: false
      };
    }

    return {
      summary: 'Problema identificado no equipamento.',
      steps: [
        'Reinicie o equipamento',
        'Verifique todas as conexões',
        'Teste com outro cabo/acessório se possível',
        'Documente qualquer mensagem de erro'
      ],
      escalate: false
    };
  }

  private diagnoseSoftware(answers: string[]): Diagnosis {
    return {
      summary: 'Problema no aplicativo identificado.',
      steps: [
        'Feche completamente o aplicativo',
        'Reinicie o computador',
        'Abra o aplicativo novamente',
        'Se o erro persistir, anote a mensagem exata e entre em contato'
      ],
      escalate: false
    };
  }

  private diagnoseAccess(answers: string[]): Diagnosis {
    return {
      summary: 'Problema de acesso identificado.',
      steps: [
        'Tente recuperar a senha usando a opção "Esqueci minha senha"',
        'Verifique se o CAPS LOCK está desligado',
        'Limpe o cache do navegador',
        'Se não conseguir, solicite reset de senha ao administrador'
      ],
      escalate: false
    };
  }

  private diagnoseGeneral(answers: string[]): Diagnosis {
    return {
      summary: 'Vou sugerir alguns passos gerais de solução.',
      steps: [
        'Reinicie o computador',
        'Verifique se há atualizações pendentes',
        'Tente reproduzir o problema e anote os detalhes',
        'Entre em contato novamente se o problema continuar'
      ],
      escalate: false
    };
  }
}
