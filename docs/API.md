# 📡 Documentação da API

Base URL: `http://localhost:3000`

## Endpoints

### POST /api/analyze

Analisa a descrição inicial do problema.

**Request:**
```json
{
  "description": "Minha internet está lenta"
}
```

**Response:**
```json
{
  "ticketId": "TK12345678",
  "classification": "Rede/Conexão",
  "urgency": "🟡 MÉDIA",
  "questions": [
    "Quando o problema começou?",
    "Outros dispositivos estão com o mesmo problema?",
    "Você já tentou reiniciar o equipamento?"
  ]
}
```

---

### POST /api/diagnose

Fornece diagnóstico baseado nas respostas.

**Request:**
```json
{
  "description": "Minha internet está lenta",
  "answers": ["Hoje de manhã", "Sim", "Não"],
  "classification": "Rede/Conexão"
}
```

**Response:**
```json
{
  "summary": "Parece ser um problema de conexão...",
  "steps": [
    "Reinicie o roteador",
    "Verifique o cabo de rede",
    "..."
  ],
  "escalate": false
}
```

---

### POST /api/reset-password

Reseta a senha de um usuário.

**Request:**
```json
{
  "username": "joao.silva"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Senha resetada com sucesso",
  "tempPassword": "Abc123xyz9"
}
```

---

### POST /api/tickets/notion

Cria um ticket no Notion.

**Request:**
```json
{
  "title": "[Rede/Conexão] Internet lenta",
  "description": "Minha internet está lenta desde hoje",
  "category": "Rede/Conexão",
  "urgency": "Média",
  "userEmail": "usuario@exemplo.com"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "abc123...",
  "url": "https://notion.so/abc123..."
}
```

---

### POST /api/tickets/supabase

Cria um ticket no Supabase.

**Request:**
```json
{
  "title": "[Rede/Conexão] Internet lenta",
  "description": "Minha internet está lenta desde hoje",
  "category": "Rede/Conexão",
  "urgency": "Média",
  "userEmail": "usuario@exemplo.com"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "uuid-here"
}
```

---

## Códigos de Status

- `200` - Sucesso
- `400` - Requisição inválida
- `500` - Erro no servidor

## Exemplos com cURL

```bash
# Analisar problema
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"description":"Internet lenta"}'

# Diagnosticar
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"description":"Internet lenta","answers":["Hoje","Sim","Não"],"classification":"Rede/Conexão"}'

# Reset de senha
curl -X POST http://localhost:3000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{"username":"joao.silva"}'
```
