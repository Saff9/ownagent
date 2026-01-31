import React, { useEffect, useMemo } from 'react';
import {
  MoreVertical,
  Share2,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { chatService } from '../../services/chat';
import { providerService } from '../../services/providers';
import { Dropdown } from '../common/Dropdown';
import type { Provider } from '../../types';

export const Header: React.FC = () => {
  const {
    currentConversation,
    updateConversation,
    setCurrentConversation,
    providers,
    setProviders,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    sidebarOpen,
    addToast,
  } = useStore();

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState('');
  const [showActions, setShowActions] = React.useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (currentConversation) {
      setSelectedProvider(currentConversation.provider);
      setSelectedModel(currentConversation.model);
    }
  }, [currentConversation, setSelectedProvider, setSelectedModel]);

  const loadProviders = async () => {
    try {
      const data = await providerService.getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const handleTitleUpdate = async () => {
    if (!currentConversation || !editTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await chatService.updateConversation(currentConversation.id, {
        title: editTitle.trim(),
      });
      updateConversation(currentConversation.id, { title: editTitle.trim() });
      setIsEditingTitle(false);
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to update title' });
    }
  };

  const handleDeleteConversation = async () => {
    if (!currentConversation) return;

    try {
      await chatService.deleteConversation(currentConversation.id);
      setCurrentConversation(null);
      addToast({ type: 'success', message: 'Conversation deleted' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to delete conversation' });
    }
  };

  const handleProviderChange = async (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = providers.find((p) => p.id === providerId);
    if (provider?.models.length) {
      setSelectedModel(provider.models[0].id);
    }
  };

  const providerOptions = useMemo(
    () =>
      providers.map((p) => ({
        value: p.id,
        label: p.name,
        icon: <ProviderIndicator provider={p} />,
        disabled: p.status !== 'available',
      })),
    [providers]
  );

  const modelOptions = useMemo(() => {
    const provider = providers.find((p) => p.id === selectedProvider);
    return (
      provider?.models.map((m) => ({
        value: m.id,
        label: m.name,
      })) || []
    );
  }, [providers, selectedProvider]);

  if (!currentConversation) {
    return (
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)]">GenZ Smart</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-tertiary)]">Ready to chat</span>
          <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl">
      {/* Left - Title */}
      <div className={`flex items-center gap-4 transition-all duration-300 ${sidebarOpen ? 'ml-0' : ''}`}>
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleUpdate();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              autoFocus
              className="px-3 py-1.5 bg-[var(--bg-input)] border border-[var(--accent-primary)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border-glow)]"
            />
            <button
              onClick={handleTitleUpdate}
              className="p-1.5 rounded-lg text-[var(--accent-success)] hover:bg-[var(--accent-success)]/10 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="p-1.5 rounded-lg text-[var(--accent-error)] hover:bg-[var(--accent-error)]/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="font-semibold text-[var(--text-primary)] truncate max-w-[300px]">
              {currentConversation.title}
            </h2>
            <button
              onClick={() => {
                setEditTitle(currentConversation.title);
                setIsEditingTitle(true);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right - Provider & Actions */}
      <div className="flex items-center gap-4">
        {/* Provider Selector */}
        <div className="flex items-center gap-2">
          <Dropdown
            options={providerOptions}
            value={selectedProvider || ''}
            onChange={handleProviderChange}
            placeholder="Select AI"
            className="min-w-[140px]"
          />
          {modelOptions.length > 0 && (
            <Dropdown
              options={modelOptions}
              value={selectedModel || ''}
              onChange={setSelectedModel}
              placeholder="Model"
              className="min-w-[140px]"
            />
          )}
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl shadow-xl z-50 animate-slideDown overflow-hidden">
                <button
                  onClick={() => {
                    // TODO: Share functionality
                    setShowActions(false);
                    addToast({ type: 'info', message: 'Share coming soon' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share conversation
                </button>
                <button
                  onClick={() => {
                    handleDeleteConversation();
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--accent-error)] hover:bg-[var(--accent-error)]/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete conversation
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const ProviderIndicator: React.FC<{ provider: Provider }> = ({ provider }) => {
  const getProviderColor = (id: string) => {
    const colors: Record<string, string> = {
      openai: '#10a37f',
      claude: '#d97757',
      deepseek: '#6366f1',
      grok: '#1d9bf0',
      openrouter: '#ef4444',
      perplexity: '#22d3ee',
    };
    return colors[id] || '#6366f1';
  };

  return (
    <span
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: getProviderColor(provider.id) }}
    />
  );
};

export default Header;
