# Troubleshooting - Notion Integration

## Erro: "Could not find database"

Este erro significa que a integração não tem permissão para acessar o database.

### Solução Passo a Passo:

#### 1. Verifique se a integração existe
- Acesse: https://www.notion.so/my-integrations
- Confirme que "HelpDesk AutoPilot" está listada
- Copie o token novamente se necessário

#### 2. Conecte a integração ao database

**IMPORTANTE: Este é o passo mais comum de ser esquecido!**

1. Abra o Notion no navegador
2. Navegue até a página do database "HelpDesk Tickets"
3. Clique nos **três pontos (...)** no canto superior direito da página
4. Procure por uma das opções:
   - "Connections" (em inglês)
   - "Conectar a" (em português)
   - "Add connections"
5. Você verá uma lista de integrações disponíveis
6. Encontre e clique em "HelpDesk AutoPilot"
7. Clique em "Confirm" ou "Confirmar"

#### 3. Verifique o Database ID

O Database ID deve ter 32 caracteres (sem hífens).

**Como obter o Database ID correto:**

1. Abra o database no Notion
2. Copie a URL completa, exemplo:
   ```
   https://www.notion.so/workspace/2bfc905a9c8880d3a1bf000cb3c15778?v=...
   ```
3. O Database ID é a parte entre o último `/` e o `?`:
   ```
   2bfc905a9c8880d3a1bf000cb3c15778
   ```

**OU se a URL for assim:**
```
https://www.notion.so/workspace/Database-Name-2bfc905a9c8880d3a1bf000cb3c15778
```
O Database ID é a última parte (32 caracteres).

#### 4. Atualize o .env

Certifique-se de que o `.env` está assim:

```env
NOTION_TOKEN=ntn_seu_token_aqui
NOTION_DATABASE_ID=2bfc905a9c8880d3a1bf000cb3c15778
```

**Sem espaços extras, sem aspas!**

#### 5. Teste novamente

```bash
npx ts-node test-notion.ts
```

---

## Checklist Completo

- [ ] Integração criada em https://www.notion.so/my-integrations
- [ ] Token copiado e colado no .env
- [ ] Database criado no Notion
- [ ] **Integração conectada ao database (passo mais importante!)**
- [ ] Database ID copiado corretamente da URL
- [ ] Database ID colado no .env sem espaços
- [ ] Arquivo .env salvo
- [ ] Teste executado

---

## Ainda não funciona?

### Verifique as propriedades do database

O database DEVE ter estas propriedades com estes nomes EXATOS:

| Nome da Propriedade | Tipo |
|---------------------|------|
| Título | Title |
| Status | Select |
| Categoria | Select |
| Urgência | Select |
| Email | Email |
| Data de Criação | Date |

**Os nomes devem ser EXATAMENTE iguais, incluindo acentos!**

### Teste com outro database

Crie um database novo do zero:
1. Crie uma página nova no Notion
2. Digite `/database` e selecione "Database - Full page"
3. Configure as propriedades conforme a tabela acima
4. Conecte a integração (passo 2 acima)
5. Copie o novo Database ID
6. Atualize o .env
7. Teste novamente
