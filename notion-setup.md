# Configuração do Notion para HelpDesk AutoPilot

## Passo 1: Criar uma Integração no Notion

1. Acesse: https://www.notion.so/my-integrations
2. Clique em "+ New integration"
3. Preencha:
   - Nome: HelpDesk AutoPilot
   - Workspace: Selecione seu workspace
   - Tipo: Internal Integration
4. Clique em "Submit"
5. Copie o "Internal Integration Token" (começa com `secret_`)
6. Cole no arquivo `.env` como `NOTION_TOKEN`

## Passo 2: Criar o Database de Tickets

1. No Notion, crie uma nova página
2. Adicione um Database (Full Page)
3. Nomeie como "HelpDesk Tickets"
4. Configure as seguintes propriedades:

### Propriedades Obrigatórias:

| Nome | Tipo | Descrição |
|------|------|-----------|
| Título | Title | Título do ticket (padrão) |
| Status | Select | Status do ticket |
| Categoria | Select | Categoria do problema |
| Urgência | Select | Nível de urgência |
| Email | Email | Email do usuário |
| Data de Criação | Date | Data de criação do ticket |

### Opções para Select:

**Status:**
- Aberto
- Em Andamento
- Resolvido
- Fechado

**Categoria:**
- Rede/Conexão
- Hardware
- Software/Aplicação
- Acesso/Senha
- Email
- Geral

**Urgência:**
- 🟢 Baixa
- 🟡 Média
- 🟠 Alta
- 🔴 Crítica

## Passo 3: Conectar a Integração ao Database

1. Abra a página do Database que você criou
2. Clique nos três pontos (...) no canto superior direito
3. Vá em "Connections" ou "Add connections"
4. Selecione "HelpDesk AutoPilot" (sua integração)
5. Clique em "Confirm"

## Passo 4: Obter o Database ID

1. Abra o Database no Notion
2. Copie a URL da página
3. O Database ID está na URL:
   ```
   https://www.notion.so/workspace/DATABASE_ID?v=...
   ```
4. Copie apenas o `DATABASE_ID` (32 caracteres)
5. Cole no arquivo `.env` como `NOTION_DATABASE_ID`

## Exemplo de .env

```env
NOTION_TOKEN=secret_abc123xyz789...
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Testando a Integração

Execute o agente e escolha a opção "Criar Ticket no Notion" no menu de workflows.

## Troubleshooting

### Erro: "Could not find database"
- Verifique se o Database ID está correto
- Confirme que a integração está conectada ao database

### Erro: "Unauthorized"
- Verifique se o token está correto
- Confirme que copiou o token completo (incluindo `secret_`)

### Erro: "Invalid property"
- Verifique se todas as propriedades obrigatórias existem no database
- Confirme que os nomes das propriedades estão exatamente como especificado
