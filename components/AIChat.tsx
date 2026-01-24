'use client';

import { useState, FormEvent } from 'react';

type ChatContext = 'hiring' | 'automation' | undefined;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [context] = useState<ChatContext>(undefined);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          context,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const assistantId = (Date.now() + 1).toString();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== assistantId);
            return [
              ...filtered,
              { id: assistantId, role: 'assistant' as const, content: assistantMessage },
            ];
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "💼 What's Caleb's experience with AI automation?",
    "🛠️ Can you show me examples of workflows he's built?",
    "📊 What's his background in process improvement?",
    "🚀 How can Caleb help my business?",
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
            I know Caleb's background, projects, and experience
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <>
              <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-300">
                👋 Hi! I'm here to answer any questions about Caleb's experience, skills, or projects.
                What would you like to know?
              </div>
              <div className="space-y-3">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(question.replace(/^[^\s]+\s/, ''))}
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
                className={`p-4 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-primary-blue/10 border border-primary-blue/20 ml-8'
                    : 'bg-primary-cyan/10 border border-primary-cyan/20'
                }`}
              >
                {message.content}
              </div>
            ))
          )}
          {isLoading && (
            <div className="p-4 bg-primary-cyan/10 border border-primary-cyan/20 rounded-lg text-sm text-gray-400">
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-primary-cyan/20">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-primary-cyan/5 border border-primary-cyan/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-cyan focus:bg-primary-cyan/10 disabled:opacity-50"
          />
        </form>
      </aside>
    </>
  );
}

// Export function to open chat with context
export function openChatWithContext(ctx: ChatContext) {
  // This will be called by Header CTA buttons
  const event = new CustomEvent('open-chat', { detail: { context: ctx } });
  window.dispatchEvent(event);
}
