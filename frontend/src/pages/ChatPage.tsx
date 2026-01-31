import React from 'react';
import { ChatLayout } from '../components/layout';
import { MessageList, ChatInput } from '../components/chat';
import { SettingsModal } from '../components/settings';
import { useStore } from '../store/useStore';
import { Sparkles, Zap, Code, Brain, MessageCircle, FileText, Wand2, Cpu } from 'lucide-react';

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
  const { sidebarOpen, isMobile, setCurrentConversation, addToast } = useStore();

  const quickActions = [
    {
      icon: <Code className="w-5 h-5" />,
      title: 'Write Code',
      description: 'Generate code in any language',
      prompt: 'Write a Python function to calculate fibonacci numbers with memoization',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: 'Explain Concepts',
      description: 'Learn complex topics simply',
      prompt: 'Explain quantum computing in simple terms with analogies',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Analyze Data',
      description: 'Get insights from your data',
      prompt: 'Help me analyze this CSV data for trends and patterns',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      title: 'Creative Writing',
      description: 'Stories, poems, and more',
      prompt: 'Write a short sci-fi story about AI discovering emotions',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const features = [
    { icon: <Zap className="w-4 h-4" />, text: 'Lightning Fast' },
    { icon: <Cpu className="w-4 h-4" />, text: 'Multiple AI Models' },
    { icon: <MessageCircle className="w-4 h-4" />, text: 'Smart Conversations' },
  ];

  const handleQuickAction = (prompt: string) => {
    // Create a new conversation with this prompt
    console.log('Starting conversation with:', prompt);
    addToast({ type: 'info', message: 'Feature coming soon!' });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
      <div
        className={`max-w-4xl w-full transition-all duration-500 ${
          sidebarOpen && !isMobile ? 'ml-[140px]' : ''
        }`}
      >
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slideUp">
          {/* Animated Logo */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl animate-float">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="absolute -top-2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 -right-2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">GenZ Smart</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-xl max-w-xl mx-auto leading-relaxed">
            Your intelligent AI companion for coding, creativity, and conversations
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-sm text-[var(--text-secondary)]"
              >
                <span className="text-[var(--accent-primary)]">{feature.icon}</span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.prompt)}
              className="group text-left p-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl hover:border-[var(--accent-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300 hover-lift hover-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white">{action.icon}</span>
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-[var(--text-tertiary)]">
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Bottom Hint */}
        <div className="text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
            <span className="text-sm text-[var(--text-secondary)]">
              Click <span className="text-[var(--accent-primary)] font-medium">"New Chat"</span> to start your journey
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default ChatPage;
