'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import type { ChatContext } from '@/lib/chat/system-prompt';

/** Extract the concatenated text content from a UIMessage's parts. */
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<ChatContext>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use a ref so the transport body function always reads the latest context
  const contextRef = useRef<ChatContext>(context);
  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  // Create transport with dynamic body that includes the current context
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ context: contextRef.current }),
      }),
    [],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  // Listen for the 'open-chat' custom event dispatched by Header CTA buttons
  useEffect(() => {
    function handleOpenChat(e: Event) {
      const detail = (e as CustomEvent).detail as {
        context: ChatContext;
      };
      setContext(detail.context);
      setIsOpen(true);
    }

    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  // Auto-scroll to bottom when messages change or status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const isWaiting = status === 'submitted';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const inputEl = form.elements.namedItem('chat-input') as HTMLInputElement;
    const value = inputEl.value.trim();
    if (!value || status === 'submitted' || status === 'streaming') return;
    sendMessage({ text: value });
    inputEl.value = '';
  };

  const handleSuggestedClick = (question: string) => {
    // Strip the leading emoji + space
    const text = question.replace(/^[^\s]+\s/, '');
    if (status === 'submitted' || status === 'streaming') return;
    sendMessage({ text });
  };

  const suggestedQuestions = [
    "\uD83D\uDCBC What's Caleb's experience with AI automation?",
    '\uD83D\uDEE0\uFE0F Can you show me examples of workflows he\'s built?',
    "\uD83D\uDCCA What's his background in process improvement?",
    '\uD83D\uDE80 How can Caleb help my business?',
  ];

  // Desktop: always visible sidebar
  // Mobile: modal triggered by FAB
  return (
    <>
      {/* Mobile: Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-cyan to-primary-blue rounded-full shadow-lg shadow-primary-cyan/40 flex items-center justify-center text-3xl z-50 animate-pulse"
      >
        💬
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-dark-base" />
      </button>

      {/* Chat Panel */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-full md:w-[400px]
          bg-dark-base/90 backdrop-blur-glass border-l border-primary-cyan/20
          flex flex-col z-[200]
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-primary-cyan/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold text-white">Ask Me Anything</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-400">
            I know Caleb&apos;s background, projects, and experience
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <>
              <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-300">
                👋 Hi! I&apos;m here to answer any questions about Caleb&apos;s experience, skills, or projects.
                What would you like to know?
              </div>
              <div className="space-y-3">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedClick(question)}
                    className="w-full text-left p-3 bg-primary-cyan/5 border border-primary-cyan/20 rounded-lg text-sm text-gray-400 hover:bg-primary-cyan/10 hover:border-primary-cyan hover:text-primary-cyan transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg text-sm whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-primary-blue/10 border border-primary-blue/20 ml-8'
                    : 'bg-primary-cyan/10 border border-primary-cyan/20'
                }`}
              >
                {getMessageText(message)}
              </div>
            ))
          )}
          {isWaiting && (
            <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-400">
              Thinking...
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              Something went wrong. Please try again.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleFormSubmit} className="p-6 border-t border-primary-cyan/20">
          <input
            type="text"
            name="chat-input"
            placeholder="Type your question..."
            disabled={status === 'submitted' || status === 'streaming'}
            className="w-full px-4 py-3 bg-primary-cyan/5 border border-primary-cyan/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-cyan focus:bg-primary-cyan/10 disabled:opacity-50"
          />
        </form>
      </aside>
    </>
  );
}
