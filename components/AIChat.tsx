'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  // Listen for the 'open-chat' custom event dispatched by Header CTA buttons
  useEffect(() => {
    function handleOpenChat() {
      setIsOpen(true);
    }
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputEl = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputEl = form.elements.namedItem('url-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-50"
        style={{
          background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
          boxShadow: '0 0 24px rgba(37,99,235,0.4)',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <div
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{ background: '#22C55E', borderColor: '#030712' }}
        />
      </button>

      {/* Chat Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full md:w-[360px] flex flex-col z-[200] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'rgba(3,7,18,0.97)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center gap-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
              boxShadow: '0 0 16px rgba(37,99,235,0.3)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              AI Assistant
            </div>
            <div className="text-xs flex items-center gap-1.5" style={{ color: '#22C55E' }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: '#22C55E', animation: 'pulse 2s infinite' }}
              />
              Online
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {!hasMessages ? (
            /* Empty State: URL Input */
            <div className="flex flex-col justify-center h-full">
              <div className="text-center mb-8">
                <p className="text-[15px] font-semibold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  What kind of business do you run?
                </p>
                <p className="text-[13px]" style={{ color: '#9CA3AF' }}>
                  Drop your website URL and I'll analyze where AI can save you time.
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="mb-4">
                <input
                  type="text"
                  name="url-input"
                  placeholder="yourcompany.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-[10px] text-sm text-white outline-none disabled:opacity-50"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(37,99,235,0.2)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-2.5 rounded-[10px] text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                    boxShadow: '0 0 16px rgba(37,99,235,0.2)',
                  }}
                >
                  Analyze My Business
                </button>
              </form>

              <p className="text-center text-[12px]" style={{ color: '#6B7280' }}>
                No website?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sendMessage({ text: "I don't have a website. Let me tell you about my business." });
                  }}
                  className="underline cursor-pointer"
                  style={{ color: '#60A5FA' }}
                >
                  Just tell me about your business
                </button>
              </p>
            </div>
          ) : (
            /* Message List */
            <div className="space-y-3">
              {messages.map((message) => {
                const text = getMessageText(message);
                if (!text) return null;
                return (
                  <div
                    key={message.id}
                    className={`p-3.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user' ? 'ml-8' : ''
                    }`}
                    style={{
                      background:
                        message.role === 'user'
                          ? 'rgba(37,99,235,0.1)'
                          : 'rgba(255,255,255,0.03)',
                      border:
                        message.role === 'user'
                          ? '1px solid rgba(37,99,235,0.15)'
                          : '1px solid rgba(255,255,255,0.06)',
                      color: message.role === 'user' ? '#F9FAFB' : '#D1D5DB',
                    }}
                  >
                    {text}
                  </div>
                );
              })}
              {status === 'submitted' && (
                <div
                  className="p-3.5 rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#6B7280',
                  }}
                >
                  Analyzing...
                </div>
              )}
              {error && (
                <div
                  className="p-3.5 rounded-xl text-[13px]"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: '#F87171',
                  }}
                >
                  Something went wrong. Please try again.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input (visible after conversation starts) */}
        {hasMessages && (
          <form
            onSubmit={handleFormSubmit}
            className="p-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <input
              type="text"
              name="chat-input"
              placeholder="Tell me more about your business..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-[10px] text-sm text-white outline-none disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </form>
        )}
      </aside>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
