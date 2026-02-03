import React from 'react';
import { ChatLayout } from '../components/layout';
import { MessageList, ChatInput } from '../components/chat';
import { SettingsModal } from '../components/settings';
import { useStore } from '../store/useStore';
import { Sparkles } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { currentConversation, settingsOpen, closeSettings } = useStore();

  return (
    <ChatLayout>
      <div className="h-full flex flex-col">
        {currentConversation ? (
          <>
            <MessageList />
            <ChatInput conversationId={currentConversation.id} />
          </>
        ) : (
          <WelcomeScreen />
        )}
      </div>
      <SettingsModal isOpen={settingsOpen} onClose={closeSettings} />
    </ChatLayout>
  );
};

const WelcomeScreen: React.FC = () => {
  const { sidebarOpen, isMobile, addToast } = useStore();

  const examples = [
    {
      title: 'Write code',
      prompt: 'Write a Python function to calculate fibonacci numbers',
    },
    {
      title: 'Explain concepts',
      prompt: 'Explain quantum computing in simple terms',
    },
    {
      title: 'Analyze data',
      prompt: 'Help me analyze this CSV data for trends',
    },
    {
      title: 'Creative writing',
      prompt: 'Write a short story about a robot learning to paint',
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={`max-w-2xl w-full transition-all duration-300 ${
          sidebarOpen && !isMobile ? 'ml-[280px]' : ''
        }`}
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
            GenZ Smart
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Your AI-powered assistant for coding, writing, and more
          </p>
        </div>

        {/* Example prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => {
                // TODO: Start new conversation with this prompt
                console.log('Example:', example.prompt);
              }}
              className="text-left p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl hover:border-[var(--accent-primary)] hover:bg-[var(--bg-hover)] transition-all group"
            >
              <h3 className="font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                {example.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                "{example.prompt}"
              </p>
            </button>
          ))}
        </div>

        {/* Quick start hint */}
        <p className="text-center mt-8 text-sm text-[var(--text-tertiary)]">
          Click "New Chat" in the sidebar to get started
        </p>
      </div>
    </div>
  );
};

export default ChatPage;