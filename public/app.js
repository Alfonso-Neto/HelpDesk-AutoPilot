let currentState = 'initial';
let sessionData = {
  ticketId: null,
  description: null,
  classification: null,
  urgency: null,
  questions: [],
  answers: [],
  diagnosis: null
};

function addMessage(content, isUser = false) {
  const chatContainer = document.getElementById('chat-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
  messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setInputState(enabled, placeholder = 'Digite sua resposta...') {
  const input = document.getElementById('user-input');
  const btn = document.getElementById('send-btn');
  input.disabled = !enabled;
  btn.disabled = !enabled;
  input.placeholder = placeholder;
  if (enabled) {
    input.focus();
  }
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, true);
  input.value = '';
  setInputState(false, 'Processando...');

  try {
    if (currentState === 'initial') {
      await handleInitialMessage(message);
    } else if (currentState === 'answering') {
      await handleAnswer(message);
    } else if (currentState === 'password-reset') {
      await handlePasswordReset(message);
    } else if (currentState === 'save-ticket') {
      await handleSaveTicket(message);
    }
  } catch (error) {
    console.error('Erro:', error);
    addMessage('❌ Desculpe, ocorreu um erro. Por favor, tente novamente.');
    setInputState(true);
  }
}

async function handleInitialMessage(description) {
  sessionData.description = description;

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  });

  const data = await response.json();
  
  sessionData.ticketId = data.ticketId;
  sessionData.classification = data.classification;
  sessionData.urgency = data.urgency;
  sessionData.questions = data.questions;

  addMessage(`
    <div class="ticket-info">
      <strong>Ticket #${data.ticketId}</strong>
      <p><strong>Categoria:</strong> ${data.classification}</p>
      <p><strong>Urgência:</strong> ${data.urgency}</p>
    </div>
    <p>Vou fazer algumas perguntas para entender melhor o problema:</p>
  `);

  currentState = 'answering';
  sessionData.currentQuestionIndex = 0;
  askNextQuestion();
}

function askNextQuestion() {
  const index = sessionData.currentQuestionIndex;
  
  if (index < sessionData.questions.length) {
    addMessage(`<strong>${index + 1}.</strong> ${sessionData.questions[index]}`);
    setInputState(true);
  } else {
    provideDiagnosis();
  }
}

async function handleAnswer(answer) {
  sessionData.answers.push(answer);
  sessionData.currentQuestionIndex++;
  askNextQuestion();
}

async function provideDiagnosis() {
  setInputState(false, 'Analisando...');
  
  const response = await fetch('/api/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description: sessionData.description,
      answers: sessionData.answers,
      classification: sessionData.classification
    })
  });

  const diagnosis = await response.json();
  sessionData.diagnosis = diagnosis;

  let stepsHtml = '<ol class="steps-list">';
  diagnosis.steps.forEach(step => {
    stepsHtml += `<li>${step}</li>`;
  });
  stepsHtml += '</ol>';

  let message = `
    <p><strong>--- Análise do Problema ---</strong></p>
    <p>${diagnosis.summary}</p>
    <p><strong>Próximos passos:</strong></p>
    ${stepsHtml}
  `;

  if (diagnosis.escalate) {
    message += `
      <div class="alert alert-warning">
        <strong>⚠️ Este caso será encaminhado para o Suporte Nível 2</strong>
        <p>Motivo: ${diagnosis.escalationReason}</p>
      </div>
    `;
  }

  addMessage(message);

  // Verifica se é problema de senha
  if (sessionData.classification.includes('Acesso') || 
      sessionData.description.toLowerCase().includes('senha')) {
    setTimeout(() => {
      addMessage(`
        <p>💡 Posso resetar sua senha agora mesmo.</p>
        <p>Digite seu nome de usuário ou email, ou digite "não" para pular:</p>
      `);
      currentState = 'password-reset';
      setInputState(true);
    }, 1000);
  } else {
    offerTicketSave();
  }
}

async function handlePasswordReset(username) {
  if (username.toLowerCase() === 'pular' || username.toLowerCase() === 'não' || username.toLowerCase() === 'nao') {
    addMessage('Ok, vamos prosseguir sem resetar a senha.');
    setTimeout(() => offerTicketSave(), 500);
    return;
  }

  setInputState(false, 'Resetando senha...');

  const response = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });

  const data = await response.json();

  if (data.success) {
    addMessage(`
      <div class="alert alert-success">
        <strong>✅ Senha resetada com sucesso!</strong>
        <p><strong>Nova senha temporária:</strong> <code style="background: #f8f9fa; padding: 5px 10px; border-radius: 5px; font-size: 1.1rem;">${data.tempPassword}</code></p>
        <p style="margin-top: 10px;">⚠️ Use esta senha para fazer login e você será solicitado a criar uma nova senha.</p>
      </div>
    `);
  }

  setTimeout(() => offerTicketSave(), 1500);
}

function offerTicketSave() {
  addMessage(`
    <p>📝 Vou registrar este atendimento para acompanhamento.</p>
  `);
  
  currentState = 'save-ticket';
  setInputState(true, 'Digite seu email para acompanhamento...');
  
  // Aguarda o email do usuário
  const originalSendMessage = window.sendMessage;
  window.sendMessage = async function() {
    const input = document.getElementById('user-input');
    const email = input.value.trim();
    
    if (!email) return;
    
    addMessage(email, true);
    input.value = '';
    setInputState(false, 'Salvando tickets...');
    
    // Restaura a função original
    window.sendMessage = originalSendMessage;
    
    await saveTicket(email);
  };
}

async function saveTicket(email) {
  const ticketData = {
    title: `[${sessionData.classification}] ${sessionData.description.substring(0, 50)}`,
    description: sessionData.description,
    category: sessionData.classification,
    urgency: extractUrgencyLevel(sessionData.urgency),
    userEmail: email
  };

  let notionSuccess = false;
  let supabaseSuccess = false;
  let notionUrl = '';
  let supabaseId = '';

  // Salva no Notion
  try {
    const response = await fetch('/api/tickets/notion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    const data = await response.json();
    if (data.success) {
      notionSuccess = true;
      notionUrl = data.url;
    }
  } catch (error) {
    console.error('Erro ao salvar no Notion:', error);
  }

  // Salva no Supabase
  try {
    const response = await fetch('/api/tickets/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    const data = await response.json();
    if (data.success) {
      supabaseSuccess = true;
      supabaseId = data.ticketId;
    }
  } catch (error) {
    console.error('Erro ao salvar no Supabase:', error);
  }

  // Mostra resultado
  let resultMessage = '<div class="ticket-save-result">';
  
  if (notionSuccess) {
    resultMessage += `<p>✅ Ticket registrado no Notion <a href="${notionUrl}" target="_blank" style="color: #667eea; font-weight: 600;">Ver ticket</a></p>`;
  } else {
    resultMessage += '<p>⚠️ Não foi possível salvar no Notion</p>';
  }

  if (supabaseSuccess) {
    resultMessage += `<p>✅ Ticket registrado no Supabase (ID: ${supabaseId})</p>`;
  } else {
    resultMessage += '<p>⚠️ Não foi possível salvar no Supabase</p>';
  }

  resultMessage += '</div>';
  addMessage(resultMessage);

  setTimeout(() => finishSession(), 1000);
}

function finishSession() {
  addMessage(`
    <div class="alert alert-success">
      <strong>✅ Atendimento finalizado!</strong>
      <p>Ticket #${sessionData.ticketId}</p>
      <p>Obrigado por entrar em contato. Até logo!</p>
    </div>
    <button class="btn" onclick="location.reload()">Novo Atendimento</button>
  `);
  setInputState(false);
}

function extractUrgencyLevel(urgency) {
  if (urgency.includes('CRÍTICA')) return 'Crítica';
  if (urgency.includes('ALTA')) return 'Alta';
  if (urgency.includes('MÉDIA')) return 'Média';
  return 'Baixa';
}

// Enter para enviar
document.getElementById('user-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Estilo adicional para resultado de salvamento
const style = document.createElement('style');
style.textContent = `
  .ticket-save-result {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
  }
  .ticket-save-result p {
    margin: 8px 0;
    font-size: 0.95rem;
  }
  .ticket-save-result a {
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .ticket-save-result a:hover {
    opacity: 0.7;
  }
`;
document.head.appendChild(style);
