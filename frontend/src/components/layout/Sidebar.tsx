import React, { useEffect } from 'react';
import {
  Plus,
  MessageSquare,
  Settings,
  PanelLeft,
  Trash2,
  Sparkles,
  Search,
  MoreHorizontal,
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
      const newConversation = await chatService.createConversation({
        provider: 'claude',
        model: 'claude-3-sonnet',
      });
      setConversations([newConversation, ...conversations]);
      setCurrentConversation({ ...newConversation, messages: [] });
      if (isMobile) setSidebarOpen(false);
      addToast({
        type: 'success',
        message: 'New conversation started',
      });
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
        className="fixed left-4 top-4 z-40 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] hover:border-[var(--accent-primary)] transition-all duration-300 shadow-lg hover:shadow-glow"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-full z-50
          w-[300px] bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-r border-[var(--border-primary)]
          flex flex-col shadow-2xl
          ${isMobile ? 'animate-slideIn' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-[var(--text-primary)] text-lg">
                GenZ Smart
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
                <span className="text-xs text-[var(--text-tertiary)]">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
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
            className="w-full btn-gradient shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          >
            New Chat
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-[var(--bg-input)] border border-[var(--border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--border-glow)] transition-all"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[var(--text-tertiary)]" />
              </div>
              <p className="text-[var(--text-secondary)] font-medium">No conversations yet</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            groupOrder.map(
              (group) =>
                groupedConversations[group]?.length > 0 && (
                  <div key={group} className="mb-4">
                    <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider px-3 mb-2">
                      {group}
                    </h3>
                    {groupedConversations[group].map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`
                          w-full text-left p-3 rounded-xl mb-1 group transition-all duration-200
                          ${
                            currentConversation?.id === conversation.id
                              ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/10 border border-violet-500/30'
                              : 'hover:bg-[var(--bg-hover)] border border-transparent'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                            ${currentConversation?.id === conversation.id 
                              ? 'bg-gradient-to-br from-violet-500 to-purple-500' 
                              : 'bg-[var(--bg-tertiary)]'}
                          `}>
                            <MessageSquare className={`w-4 h-4 ${currentConversation?.id === conversation.id ? 'text-white' : 'text-[var(--text-tertiary)]'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${
                              currentConversation?.id === conversation.id 
                                ? 'text-[var(--accent-primary)]' 
                                : 'text-[var(--text-primary)]'
                            }`}>
                              {conversation.title}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">
                              {new Date(conversation.updated_at).toLocaleDateString()} • {conversation.provider}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(e, conversation.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent-error)] hover:bg-[var(--accent-error)]/10 transition-all"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>
                )
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-primary)]">
          <button
            onClick={openSettings}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center group-hover:bg-[var(--accent-primary)]/20 transition-colors">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
