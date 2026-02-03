import React, { useEffect } from 'react';
import {
  Plus,
  MessageSquare,
  Settings,
  PanelLeft,
  Pin,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { chatService } from '../../services/chat';
import { Button } from '../common/Button';
import type { Conversation } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    openSettings,
    isMobile,
    addToast,
  } = useStore();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      // Get the selected provider/model from store, or use defaults
      const { selectedProvider, selectedModel } = useStore.getState();
      const provider = selectedProvider || 'claude';
      const model = selectedModel || 'claude-3-sonnet';
      
      const newConversation = await chatService.createConversation({
        provider,
        model,
      });
      setConversations([newConversation, ...conversations]);
      setCurrentConversation({ ...newConversation, messages: [] });
      if (isMobile) setSidebarOpen(false);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to create new conversation',
      });
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      const detail = await chatService.getConversation(conversation.id);
      setCurrentConversation(detail);
      if (isMobile) setSidebarOpen(false);
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to load conversation',
      });
    }
  };

  const handleDeleteConversation = async (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    try {
      await chatService.deleteConversation(id);
      setConversations(conversations.filter((c) => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
      addToast({
        type: 'success',
        message: 'Conversation deleted',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to delete conversation',
      });
    }
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (groups, conv) => {
      const date = new Date(conv.updated_at);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      let group = 'Older';
      if (days === 0) group = 'Today';
      else if (days === 1) group = 'Yesterday';
      else if (days < 7) group = 'Previous 7 Days';

      if (!groups[group]) groups[group] = [];
      groups[group].push(conv);
      return groups;
    },
    {} as Record<string, Conversation[]>
  );

  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-40 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        aria-label="Open sidebar"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full z-50
          w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-primary)]
          flex flex-col
          ${isMobile ? 'animate-slideIn' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)]">
              GenZ Smart
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Close sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full"
          >
            New Chat
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-[var(--text-tertiary)]">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            groupOrder.map(
              (group) =>
                groupedConversations[group]?.length > 0 && (
                  <div key={group} className="mb-4">
                    <h3 className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider px-2 mb-2">
                      {group}
                    </h3>
                    {groupedConversations[group].map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`
                          w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
                          text-left text-sm transition-colors duration-150
                          group relative
                          ${
                            currentConversation?.id === conversation.id
                              ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                          }
                        `}
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">
                            {conversation.title}
                          </p>
                          <p className="text-xs opacity-60">
                            {conversation.message_count} messages
                          </p>
                        </div>
                        {conversation.is_pinned && (
                          <Pin className="w-3 h-3 flex-shrink-0 text-[var(--accent-primary)]" />
                        )}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={(e) =>
                              handleDeleteConversation(e, conversation.id)
                            }
                            className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--accent-error)]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )
            )
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[var(--border-primary)] space-y-2">
          <button
            onClick={openSettings}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;