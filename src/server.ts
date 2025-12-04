import 'dotenv/config';
import express from 'express';
import { TicketClassifier } from './agent/TicketClassifier.js';
import { UrgencyChecker } from './agent/UrgencyChecker.js';
import { DiagnosticEngine } from './agent/DiagnosticEngine.js';
import { NotionTicketWorkflow } from './workflows/NotionTicketWorkflow.js';
import { CreateTicketWorkflow } from './workflows/CreateTicketWorkflow.js';
import { createClient } from '@supabase/supabase-js';
import { Client } from '@notionhq/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const classifier = new TicketClassifier();
const urgencyChecker = new UrgencyChecker();
const diagnosticEngine = new DiagnosticEngine();

// Endpoint para análise inicial
app.post('/api/analyze', (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Descrição é obrigatória' });
    }

    const classification = classifier.classify(description);
    const urgency = urgencyChecker.check(description);
    const ticketId = 'TK' + Date.now().toString().slice(-8);

    // Gera perguntas baseadas na classificação
    const questions = getEssentialQuestions(classification);

    res.json({
      ticketId,
      classification,
      urgency,
      questions
    });
  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ error: 'Erro ao analisar problema' });
  }
});

// Endpoint para diagnóstico
app.post('/api/diagnose', (req, res) => {
  try {
    const { description, answers, classification } = req.body;

    if (!description || !answers || !classification) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const diagnosis = diagnosticEngine.diagnose(description, answers, classification);

    res.json(diagnosis);
  } catch (error) {
    console.error('Erro no diagnóstico:', error);
    res.status(500).json({ error: 'Erro ao diagnosticar problema' });
  }
});

// Endpoint para reset de senha
app.post('/api/reset-password', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Nome de usuário é obrigatório' });
    }

    // Simula reset de senha
    await delay(1500);
    const tempPassword = generateTempPassword();

    res.json({
      success: true,
      message: 'Senha resetada com sucesso',
      tempPassword
    });
  } catch (error) {
    console.error('Erro no reset:', error);
    res.status(500).json({ error: 'Erro ao resetar senha' });
  }
});

// Endpoint para criar ticket no Notion
app.post('/api/tickets/notion', async (req, res) => {
  try {
    const { title, description, category, urgency, userEmail } = req.body;

    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!notionToken || !databaseId) {
      return res.status(500).json({ error: 'Notion não configurado' });
    }

    const notion = new Client({ auth: notionToken });

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Título': {
          title: [{ text: { content: title } }]
        },
        'Status': {
          select: { name: 'Aberto' }
        },
        'Categoria': {
          select: { name: category }
        },
        'Urgência': {
          select: { name: urgency }
        },
        'Email': {
          email: userEmail
        },
        'Data de Criação': {
          date: { start: new Date().toISOString() }
        }
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: description } }]
          }
        }
      ]
    });

    const pageUrl = `https://notion.so/${response.id.replace(/-/g, '')}`;

    res.json({
      success: true,
      ticketId: response.id,
      url: pageUrl
    });
  } catch (error: any) {
    console.error('Erro ao criar ticket no Notion:', error);
    res.status(500).json({ error: error.message || 'Erro ao criar ticket no Notion' });
  }
});

// Endpoint para criar ticket no Supabase
app.post('/api/tickets/supabase', async (req, res) => {
  try {
    const { title, description, category, urgency, userEmail } = req.body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase não configurado' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        title,
        description,
        category,
        urgency,
        user_email: userEmail,
        status: 'Aberto',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      ticketId: data.id
    });
  } catch (error: any) {
    console.error('Erro ao criar ticket no Supabase:', error);
    res.status(500).json({ error: error.message || 'Erro ao criar ticket no Supabase' });
  }
});

// Funções auxiliares
function getEssentialQuestions(classification: string): string[] {
  if (classification.includes('Rede') || classification.includes('Conexão')) {
    return [
      'Quando o problema começou? (hoje, ontem, há uma semana)',
      'Outros dispositivos estão com o mesmo problema?',
      'Você já tentou reiniciar o equipamento?'
    ];
  } else if (classification.includes('Software') || classification.includes('Aplicação')) {
    return [
      'Qual aplicativo está apresentando o problema?',
      'Você recebe alguma mensagem de erro? Se sim, qual?',
      'O problema acontece sempre ou só às vezes?'
    ];
  } else if (classification.includes('Hardware')) {
    return [
      'Qual equipamento está com problema?',
      'Houve alguma queda ou dano físico recente?',
      'O equipamento liga normalmente?'
    ];
  } else {
    return [
      'Quando você notou o problema pela primeira vez?',
      'O problema afeta seu trabalho neste momento?',
      'Você já tentou alguma solução? Se sim, qual?'
    ];
  }
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.listen(PORT, () => {
  console.log(`\n🚀 HelpDesk AutoPilot Web rodando em http://localhost:${PORT}`);
  console.log(`📝 Acesse o navegador para usar a interface web\n`);
});
