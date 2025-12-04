# 📝 Comandos Git para Publicar no GitHub

## Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `helpdesk-autopilot`
4. Descrição: `Sistema inteligente de atendimento de Suporte Nível 1`
5. **NÃO** marque "Initialize with README"
6. Clique em **"Create repository"**

## Passo 2: Executar Comandos

Copie e cole estes comandos no terminal (um de cada vez):

```bash
# 1. Inicializar Git
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o primeiro commit
git commit -m "🎉 Initial commit: HelpDesk AutoPilot v1.0.0"

# 4. Renomear branch para main
git branch -M main

# 5. Adicionar repositório remoto (SUBSTITUA com sua URL)
git remote add origin https://github.com/SEU-USUARIO/helpdesk-autopilot.git

# 6. Fazer push
git push -u origin main
```

## Passo 3: Verificar

Acesse seu repositório no GitHub e veja todos os arquivos publicados!

## Comandos Úteis para o Futuro

### Fazer alterações e publicar

```bash
# Ver status
git status

# Adicionar arquivos modificados
git add .

# Fazer commit
git commit -m "feat: descrição da mudança"

# Enviar para GitHub
git push
```

### Criar uma nova feature

```bash
# Criar e mudar para nova branch
git checkout -b feature/minha-feature

# Fazer alterações e commit
git add .
git commit -m "feat: adiciona minha feature"

# Enviar branch
git push origin feature/minha-feature
```

### Ver histórico

```bash
git log --oneline --graph
```

### Desfazer mudanças

```bash
# Desfazer mudanças não commitadas
git checkout -- arquivo.ts

# Desfazer último commit (mantém alterações)
git reset --soft HEAD~1

# Desfazer último commit (descarta alterações)
git reset --hard HEAD~1
```

## Padrões de Commit

Use estes prefixos:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

Exemplos:
```bash
git commit -m "feat: adiciona integração com Slack"
git commit -m "fix: corrige bug no reset de senha"
git commit -m "docs: atualiza README com exemplos"
```

## Ignorar Arquivos

O `.gitignore` já está configurado para ignorar:
- `node_modules/`
- `.env`
- `dist/`
- Arquivos de teste

## Problemas Comuns

### "Permission denied"
```bash
# Use HTTPS ao invés de SSH
git remote set-url origin https://github.com/SEU-USUARIO/helpdesk-autopilot.git
```

### "Repository not found"
```bash
# Verifique se a URL está correta
git remote -v

# Corrija se necessário
git remote set-url origin https://github.com/SEU-USUARIO/helpdesk-autopilot.git
```

### Conflitos ao fazer push
```bash
# Puxe as mudanças primeiro
git pull origin main

# Resolva conflitos se houver
# Depois faça push
git push
```
