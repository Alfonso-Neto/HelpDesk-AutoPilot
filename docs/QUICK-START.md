# 🚀 Guia Rápido de Início

## Instalação em 5 Minutos

### 1. Clone e Instale

```bash
git clone https://github.com/seu-usuario/helpdesk-autopilot.git
cd helpdesk-autopilot
npm install
```

### 2. Configure o Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Settings → API**
4. Copie a **URL** e a **anon/public key**
5. Vá em **SQL Editor** e execute o conteúdo de `supabase-setup.sql`

### 3. Configure o Notion

1. Acesse [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **+ New integration**
3. Copie o **Internal Integration Token**
4. Crie um database no Notion com as propriedades do `notion-setup.md`
5. Conecte a integração ao database (três pontos → Connections)
6. Copie o **Database ID** da URL

### 4. Configure o .env

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais.

### 5. Execute

```bash
npm run build
npm run web
```

Acesse: http://localhost:3000

## Pronto! 🎉

Seu HelpDesk AutoPilot está funcionando!

## Próximos Passos

- Personalize as categorias em `src/agent/TicketClassifier.ts`
- Ajuste os níveis de urgência em `src/agent/UrgencyChecker.ts`
- Customize o diagnóstico em `src/agent/DiagnosticEngine.ts`
- Modifique o visual em `public/styles.css`

## Problemas?

Consulte:
- [SUPABASE-SETUP.md](../SUPABASE-SETUP.md)
- [TROUBLESHOOTING-NOTION.md](../TROUBLESHOOTING-NOTION.md)
- [Issues no GitHub](https://github.com/seu-usuario/helpdesk-autopilot/issues)
