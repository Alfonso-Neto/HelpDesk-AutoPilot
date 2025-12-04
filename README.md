# 🤖 HelpDesk AutoPilot

Sistema inteligente de atendimento de Suporte Nível 1 com interface web moderna e integração com Notion e Supabase.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 📋 Sobre o Projeto

HelpDesk AutoPilot é um agente inteligente que automatiza o atendimento de suporte técnico Nível 1. Ele diagnostica problemas, coleta informações essenciais, sugere soluções e registra tickets automaticamente.

### ✨ Funcionalidades

- 🔍 **Diagnóstico Automático**: Classifica problemas em categorias (Rede, Hardware, Software, Acesso, Email)
- 🚨 **Análise de Urgência**: Identifica automaticamente o nível de urgência (Crítica, Alta, Média, Baixa)
- ❓ **3 Perguntas Essenciais**: Faz perguntas contextuais baseadas no tipo de problema
- 💡 **Soluções Guiadas**: Fornece passos claros para resolver o problema
- 🔑 **Reset de Senha**: Workflow automático para reset de senha
- 📝 **Registro Automático**: Salva tickets no Notion e Supabase simultaneamente
- 🌐 **Interface Web**: Chat interativo e moderno
- 🖥️ **CLI**: Versão para terminal

## 🚀 Demo

### Interface Web
![Demo Web](https://via.placeholder.com/800x450/667eea/ffffff?text=HelpDesk+AutoPilot+Web)

### CLI
```
=== HelpDesk AutoPilot ===

Olá! Sou o assistente de Suporte Nível 1.
Vou ajudá-lo a resolver seu problema.

Descreva o problema que está enfrentando: Minha internet está lenta

[Ticket #TK12345678]
Categoria: Rede/Conexão
Urgência: 🟡 MÉDIA

1. Quando o problema começou? (hoje, ontem, há uma semana)
> Hoje de manhã
...
```

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no [Notion](https://notion.so)
- Conta no [Supabase](https://supabase.com)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/helpdesk-autopilot.git
cd helpdesk-autopilot
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_public

# Notion
NOTION_TOKEN=secret_seu_token_aqui
NOTION_DATABASE_ID=seu_database_id

# API
API_BASE_URL=http://localhost:3000
```

4. **Configure o Supabase**

Execute o script SQL no Supabase SQL Editor:
```bash
# Veja o arquivo: supabase-setup.sql
```

Guia completo: [SUPABASE-SETUP.md](./SUPABASE-SETUP.md)

5. **Configure o Notion**

Siga o guia completo: [notion-setup.md](./notion-setup.md)

Troubleshooting: [TROUBLESHOOTING-NOTION.md](./TROUBLESHOOTING-NOTION.md)

6. **Compile o projeto**
```bash
npm run build
```

## 🎯 Como Usar

### Interface Web (Recomendado)

```bash
npm run web
```

Acesse: http://localhost:3000

### CLI (Terminal)

```bash
npm start
```

### Modo Desenvolvimento

```bash
# Web com hot reload
npm run dev:web

# CLI com hot reload
npm run dev
```

## 🧪 Testes

Teste as integrações antes de usar:

```bash
# Testar Notion
npx ts-node test-notion.ts

# Testar Supabase
npx ts-node test-supabase.ts
```

## 📁 Estrutura do Projeto

```
helpdesk-autopilot/
├── src/
│   ├── agent/
│   │   ├── HelpDeskAgent.ts          # Agente principal
│   │   ├── TicketClassifier.ts       # Classificador de tickets
│   │   ├── UrgencyChecker.ts         # Verificador de urgência
│   │   └── DiagnosticEngine.ts       # Motor de diagnóstico
│   ├── workflows/
│   │   ├── WorkflowManager.ts        # Gerenciador de workflows
│   │   ├── PasswordResetWorkflow.ts  # Workflow de reset de senha
│   │   ├── CreateTicketWorkflow.ts   # Workflow Supabase
│   │   └── NotionTicketWorkflow.ts   # Workflow Notion
│   ├── server.ts                     # Servidor Express (API)
│   └── index.ts                      # CLI entry point
├── public/
│   ├── index.html                    # Interface web
│   ├── styles.css                    # Estilos
│   └── app.js                        # Lógica do frontend
├── .env                              # Variáveis de ambiente (não commitado)
├── .env.example                      # Exemplo de configuração
├── tsconfig.json                     # Configuração TypeScript
├── package.json                      # Dependências
└── README.md                         # Este arquivo
```

## 🔧 Tecnologias

- **Backend**: Node.js, TypeScript, Express
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Banco de Dados**: Supabase (PostgreSQL)
- **Produtividade**: Notion API
- **Build**: TypeScript Compiler

## 🎨 Comportamentos do Agente

### Classificação Automática
- **Rede/Conexão**: Problemas de internet, WiFi, conectividade
- **Hardware**: Equipamentos físicos, impressoras, monitores
- **Software/Aplicação**: Programas, aplicativos, sistemas
- **Acesso/Senha**: Login, autenticação, senhas
- **Email**: Problemas com email
- **Geral**: Outros problemas

### Níveis de Urgência
- 🔴 **CRÍTICA**: Sistema parado, produção afetada
- 🟠 **ALTA**: Não funciona, bloqueado
- 🟡 **MÉDIA**: Lento, intermitente
- 🟢 **BAIXA**: Problemas menores

### Escalação Automática
O agente escala para Nível 2 quando:
- Problema de infraestrutura (servidor, banco de dados)
- Soluções básicas já foram tentadas
- Problema persistente por muito tempo

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Seu Nome
- GitHub: [@Alfonso-Neto](https://github.com/Alfonso-Neto)
- LinkedIn: [Alfonso Neto](https://linkedin.com/in/alfonsoneto7)

## 🙏 Agradecimentos

- [Notion API](https://developers.notion.com/)
- [Supabase](https://supabase.com/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

## 📞 Suporte

Se você tiver alguma dúvida ou problema:

1. Verifique a [documentação](./docs)
2. Consulte os guias de troubleshooting
3. Abra uma [issue](https://github.com/seu-usuario/helpdesk-autopilot/issues)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
