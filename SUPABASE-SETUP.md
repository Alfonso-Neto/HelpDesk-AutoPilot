# Configuração do Supabase para HelpDesk AutoPilot

## Passo 1: Criar uma conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub, Google ou email

## Passo 2: Criar um novo projeto

1. No dashboard, clique em "New Project"
2. Preencha:
   - **Name**: HelpDesk AutoPilot
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a região mais próxima (ex: South America)
   - **Pricing Plan**: Free (suficiente para começar)
3. Clique em "Create new project"
4. Aguarde 2-3 minutos enquanto o projeto é criado

## Passo 3: Obter as credenciais

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá duas informações importantes:

### Project URL
```
https://seu-projeto.supabase.co
```
Copie e cole no `.env` como `SUPABASE_URL`

### API Keys
Você verá duas chaves:
- **anon/public**: Use esta! (é segura para uso no cliente)
- **service_role**: NÃO use (tem acesso total ao banco)

Copie a chave **anon public** e cole no `.env` como `SUPABASE_KEY`

## Passo 4: Criar a tabela de tickets

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor SQL
5. Clique em **"Run"** (ou pressione Ctrl+Enter)
6. Você verá a mensagem "Success. No rows returned"

## Passo 5: Verificar a tabela criada

1. No menu lateral, clique em **"Table Editor"**
2. Você deve ver a tabela **"tickets"** listada
3. Clique nela para ver a estrutura:
   - id (uuid)
   - title (text)
   - description (text)
   - category (text)
   - urgency (text)
   - user_email (text)
   - status (text)
   - created_at (timestamp)
   - updated_at (timestamp)

## Passo 6: Atualizar o arquivo .env

Edite o arquivo `.env` na raiz do projeto:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_public_aqui
API_BASE_URL=http://localhost:3000

# Notion Configuration
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

**Importante:**
- Use a URL completa (com https://)
- Use a chave **anon/public**, não a service_role
- Sem espaços extras, sem aspas

## Passo 7: Testar a conexão

Execute o script de teste:

```bash
npx ts-node test-supabase.ts
```

Se tudo estiver correto, você verá:
```
✅ Conexão com Supabase OK
✅ Ticket de teste criado com sucesso!
```

## Passo 8: Usar no agente

Execute o agente:
```bash
npm start
```

Após o diagnóstico, escolha:
- Opção **2**: Criar Ticket no Supabase
- Opção **4**: Listar Tickets (Supabase)

---

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se copiou a chave **anon/public** (não a service_role)
- Confirme que não há espaços extras no .env

### Erro: "relation 'tickets' does not exist"
- Execute o script SQL novamente no SQL Editor
- Verifique se a tabela aparece no Table Editor

### Erro: "Failed to fetch"
- Verifique se a URL está correta (com https://)
- Confirme que o projeto está ativo no Supabase

### Erro: "Row Level Security"
- O script SQL já configura as políticas RLS
- Se ainda houver erro, desabilite RLS temporariamente:
  1. Vá em Table Editor > tickets
  2. Clique em "RLS disabled" para desabilitar

---

## Recursos Adicionais

- **Dashboard**: Visualize todos os tickets criados em Table Editor
- **Logs**: Veja as requisições em Logs > API
- **Backup**: Configure backups automáticos em Database > Backups
- **Upgrade**: Se precisar de mais recursos, faça upgrade do plano

---

## Checklist

- [ ] Conta criada no Supabase
- [ ] Projeto criado
- [ ] SUPABASE_URL copiada para .env
- [ ] SUPABASE_KEY (anon/public) copiada para .env
- [ ] Script SQL executado no SQL Editor
- [ ] Tabela "tickets" visível no Table Editor
- [ ] Arquivo .env salvo
- [ ] Teste executado com sucesso
