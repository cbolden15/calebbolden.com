'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';

const BOOKING_URL = process.env.NEXT_PUBLIC_CALENDLY_CLIENT_URL || '/contact';
const CHAT_COLLAPSED_STORAGE_KEY = 'chat-collapsed';

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasLoadedCollapseState, setHasLoadedCollapseState] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [messages, status]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(CHAT_COLLAPSED_STORAGE_KEY);
    if (storedValue === 'true') {
      setIsCollapsed(true);
    }
    setHasLoadedCollapseState(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.chat = isCollapsed ? 'collapsed' : 'open';
    if (hasLoadedCollapseState) {
      window.localStorage.setItem(CHAT_COLLAPSED_STORAGE_KEY, String(isCollapsed));
    }
  }, [isCollapsed, hasLoadedCollapseState]);

  useEffect(() => {
    function handleOpenChat(e: Event) {
      setIsOpen(true);
      setIsCollapsed(false);

      if (!(e instanceof CustomEvent)) return;
      const email = e.detail?.email;
      if (!isValidEmail(email)) return;

      sendMessage({ text: `My email is ${email.trim()}. I'd like an analysis of my business.` });
    }

    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, [sendMessage]);

  const isLoading = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;
  const panelTransformClass = isCollapsed
    ? 'translate-x-full'
    : isOpen
      ? 'translate-x-0'
      : 'translate-x-full md:translate-x-0';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const inputEl = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const inputEl = form.elements.namedItem('url-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setIsCollapsed(false);
        }}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.55_0.09_210)] text-white transition-colors hover:bg-[oklch(0.62_0.09_210)] motion-reduce:transition-none md:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {isCollapsed && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsCollapsed(false);
          }}
          aria-label="Show assistant"
          className="anno fixed right-0 top-1/2 z-[190] hidden -translate-y-1/2 items-center rounded-l-[6px] px-2.5 py-4 text-white transition-colors hover:text-[oklch(0.75_0.07_210)] motion-reduce:transition-none md:flex"
          style={{
            background: 'oklch(0.21 0.015 230)',
            writingMode: 'vertical-rl',
            color: 'white',
          }}
        >
          Assistant
        </button>
      )}

      <aside
        aria-label="Chat with Caleb's AI assistant"
        className={`fixed right-0 top-0 z-[200] flex h-screen w-full flex-col transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:w-[360px] ${panelTransformClass}`}
        style={{
          background: 'oklch(0.21 0.015 230)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          className="flex items-center gap-3 p-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[2px]"
            style={{ border: '1px solid oklch(0.55 0.09 210)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7 6H13M10 6V9.5M5 9.5H15M5 12V9.5M15 12V9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
              <rect x="6.5" y="3.5" width="7" height="5" rx="0.8" stroke="white" strokeWidth="1.4" />
              <rect x="2.5" y="11.5" width="5" height="4.5" rx="0.8" stroke="white" strokeWidth="1.4" />
              <rect x="12.5" y="11.5" width="5" height="4.5" rx="0.8" stroke="white" strokeWidth="1.4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-[16px] text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 650 }}
            >
              Caleb&apos;s assistant
            </div>
            <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              A live agent I built on{' '}
              <a
                href="https://voratechnology.com"
                target="_blank"
                rel="noopener"
                className="hover:underline"
                style={{ color: 'oklch(0.75 0.07 210)' }}
              >
                Vora
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label="Hide assistant"
            className="hidden h-9 w-9 items-center justify-center rounded-[6px] text-white transition-colors hover:bg-[rgba(255,255,255,0.08)] motion-reduce:transition-none md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-white transition-colors hover:bg-[rgba(255,255,255,0.08)] motion-reduce:transition-none md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5" aria-live="polite">
          {!hasMessages ? (
            <div className="flex h-full flex-col justify-center">
              <div className="mb-8 text-center">
                <p
                  className="mb-2 text-[15px] font-semibold text-white"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  What kind of business do you run?
                </p>
                <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.68)' }}>
                  Drop your website URL and I&apos;ll analyze where AI can save you time.
                </p>
              </div>

              <form onSubmit={handleUrlSubmit} className="mb-4">
                <input
                  type="text"
                  name="url-input"
                  placeholder="yourcompany.com"
                  disabled={isLoading}
                  className="w-full rounded-[6px] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[rgba(255,255,255,0.55)] focus:border-[oklch(0.55_0.09_210)] focus:outline-2 focus:outline-offset-0 focus:outline-[oklch(0.55_0.09_210)] disabled:opacity-50 motion-reduce:transition-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 w-full cursor-pointer rounded-[6px] bg-[oklch(0.55_0.09_210)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[oklch(0.62_0.09_210)] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
                >
                  Analyze my business
                </button>
              </form>

              <p className="text-center text-[12px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
                No website?{' '}
                <button
                  type="button"
                  onClick={() => {
                    sendMessage({ text: "I don't have a website. Let me tell you about my business." });
                  }}
                  className="cursor-pointer underline"
                  style={{ color: 'oklch(0.75 0.07 210)' }}
                >
                  Just tell me about your business
                </button>
              </p>
              <p className="mt-3 text-center text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                This is the same kind of system I build for clients.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => {
                const text = getMessageText(message);
                if (!text) return null;
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`rounded-[2px] p-3.5 text-[13.5px] leading-[1.6] whitespace-pre-wrap ${
                      isUser ? 'ml-8' : ''
                    }`}
                    style={{
                      background: isUser ? 'rgba(255,255,255,0.09)' : 'transparent',
                      border: isUser ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
                      color: isUser ? 'white' : 'rgba(255,255,255,0.82)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {text}
                  </div>
                );
              })}
              {status === 'submitted' && (
                <div
                  className="anno rounded-[2px] p-3.5"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  Analyzing...
                </div>
              )}
              {error && (
                <div
                  className="rounded-[2px] p-3.5 text-[13.5px] leading-[1.6]"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.18)',
                    color: '#FCA5A5',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Something went wrong. Please try again.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {hasMessages && (
          <form
            onSubmit={handleFormSubmit}
            className="p-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                name="chat-input"
                placeholder="Tell me more about your business..."
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-[6px] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[rgba(255,255,255,0.55)] focus:border-[oklch(0.55_0.09_210)] focus:outline-2 focus:outline-offset-0 focus:outline-[oklch(0.55_0.09_210)] disabled:opacity-50 motion-reduce:transition-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                type="submit"
                disabled={isLoading}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[oklch(0.55_0.09_210)] text-white transition-colors hover:bg-[oklch(0.62_0.09_210)] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-[13px]" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Prefer to talk it through?{' '}
              <a
                href={BOOKING_URL}
                className="hover:underline"
                style={{ color: 'oklch(0.75 0.07 210)', fontSize: 13 }}
              >
                Book a call with Caleb
              </a>
            </p>
          </form>
        )}
      </aside>
    </>
  );
}
