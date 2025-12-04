# 🚀 Guia de Deploy

## GitHub

### Primeira vez

```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "🎉 Initial commit: HelpDesk AutoPilot v1.0.0"

# Adicionar repositório remoto (substitua com seu URL)
git remote add origin https://github.com/seu-usuario/helpdesk-autopilot.git

# Push para o GitHub
git branch -M main
git push -u origin main
```

### Atualizações futuras

```bash
git add .
git commit -m "feat: sua mensagem aqui"
git push
```

## Deploy em Produção

### Opção 1: Vercel (Recomendado para Web)

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure as variáveis de ambiente no dashboard da Vercel

### Opção 2: Heroku

1. Crie um `Procfile`:
```
web: npm run web
```

2. Deploy:
```bash
heroku create helpdesk-autopilot
git push heroku main
heroku config:set SUPABASE_URL=sua_url
heroku config:set SUPABASE_KEY=sua_key
heroku config:set NOTION_TOKEN=seu_token
heroku config:set NOTION_DATABASE_ID=seu_id
```

### Opção 3: Railway

1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Opção 4: VPS (DigitalOcean, AWS, etc)

```bash
# No servidor
git clone https://github.com/seu-usuario/helpdesk-autopilot.git
cd helpdesk-autopilot
npm install
npm run build

# Configure .env
nano .env

# Use PM2 para manter rodando
npm install -g pm2
pm2 start dist/server.js --name helpdesk
pm2 save
pm2 startup
```

## Variáveis de Ambiente em Produção

Certifique-se de configurar:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anon_public
NOTION_TOKEN=secret_seu_token
NOTION_DATABASE_ID=seu_database_id
API_BASE_URL=https://seu-dominio.com
PORT=3000
NODE_ENV=production
```

## SSL/HTTPS

Para produção, sempre use HTTPS. A maioria das plataformas (Vercel, Heroku, Railway) fornecem SSL automaticamente.

## Monitoramento

Considere usar:
- **Sentry** para tracking de erros
- **LogRocket** para sessões de usuário
- **Google Analytics** para métricas

## Backup

Configure backups automáticos no Supabase:
1. Vá em Database → Backups
2. Configure backup diário

## Domínio Customizado

Configure seu domínio na plataforma de hospedagem escolhida.
