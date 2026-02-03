import React, { useEffect, useMemo } from 'react';
import {
  MoreVertical,
  Share2,
  Trash2,
  Edit2,
  Check,
  X,
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
      <header
        className={`
          h-16 border-b border-[var(--border-primary)]
          flex items-center justify-between px-4
          bg-[var(--bg-primary)]
          ${sidebarOpen ? 'ml-[280px]' : ''}
          transition-all duration-300
        `}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-semibold text-[var(--text-primary)]">
            GenZ Smart
          </span>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`
        h-16 border-b border-[var(--border-primary)]
        flex items-center justify-between px-4
        bg-[var(--bg-primary)]
        ${sidebarOpen && !useStore.getState().isMobile ? 'ml-[280px]' : ''}
        transition-all duration-300
      `}
    >
      {/* Title Section */}
      <div className="flex items-center gap-3">
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
              className="bg-[var(--bg-input)] border border-[var(--border-primary)] rounded px-2 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              autoFocus
            />
            <button
              onClick={handleTitleUpdate}
              className="p-1 rounded text-[var(--accent-success)] hover:bg-[var(--bg-hover)]"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="p-1 rounded text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-[var(--text-primary)]">
              {currentConversation.title}
            </h1>
            <button
              onClick={() => {
                setEditTitle(currentConversation.title);
                setIsEditingTitle(true);
              }}
              className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Provider & Model Selectors */}
      <div className="flex items-center gap-3">
        <Dropdown
          options={providerOptions}
          value={selectedProvider || ''}
          onChange={handleProviderChange}
          className="w-40"
        />

        {modelOptions.length > 0 && (
          <Dropdown
            options={modelOptions}
            value={selectedModel || ''}
            onChange={setSelectedModel}
            className="w-40"
          />
        )}

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50 animate-fadeIn">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/chat/${currentConversation.id}`
                  );
                  addToast({ type: 'success', message: 'Link copied!' });
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)] first:rounded-t-lg"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => {
                  handleDeleteConversation();
                  setShowActions(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--accent-error)] hover:bg-[var(--bg-hover)] last:rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const ProviderIndicator: React.FC<{ provider: Provider }> = ({ provider }) => {
  const colors: Record<string, string> = {
    deepseek: '#4f46e5',
    claude: '#d97757',
    grok: '#1d9bf0',
    openai: '#10a37f',
    openrouter: '#ef4444',
    perplexity: '#22d3ee',
  };

  return (
    <span
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[provider.id] || '#6366f1' }}
    />
  );
};

export default Header;