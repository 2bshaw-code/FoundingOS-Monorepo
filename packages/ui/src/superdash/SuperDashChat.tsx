/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { useState } from 'react';

type ChatMessage = { role: 'assistant' | 'user'; text: string };

export const SuperDashChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi, I\u2019m FoundAI. Ask me about any core module\u2019s quantum score or trend.' },
  ]);

  const submit = () => {
    const clean = input.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: `Looking at the SuperDashboard, here's my take on: ${clean}.` },
    ]);
    setInput('');
  };

  return (
    <div style={{ marginTop: 24 }}>
      <button type="button" className="btn btn-primary btn-premium" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close AI Chat' : 'Open AI Chat'}
      </button>

      {open ? (
        <div className="premium-card premium-fade-in" style={{ marginTop: 16, padding: 16 }}>
          <div className="found-ai-chat">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`found-ai-message ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask FoundAI about the SuperDashboard..."
              rows={2}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-primary btn-premium" onClick={submit}>Send</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
