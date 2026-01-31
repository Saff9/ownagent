import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot, Copy, RotateCcw, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CodeBlock } from './CodeBlock';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
}) => {
  const { addToast } = useStore();
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      addToast({ type: 'success', message: 'Message copied!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to copy message' });
    }
  };

  const handleRegenerate = () => {
    // TODO: Implement regenerate functionality
    addToast({ type: 'info', message: 'Regenerate coming soon' });
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    addToast({ type: 'info', message: 'Delete coming soon' });
  };

  return (
    <div
      className={`flex gap-4 px-4 py-6 ${
        isUser ? 'bg-transparent' : 'bg-[var(--bg-secondary)]/50'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-[var(--text-primary)]">
            {isUser ? 'You' : 'GenZ Smart'}
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isStreaming && (
            <span className="flex items-center gap-1 text-xs text-[var(--accent-primary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              Typing...
            </span>
          )}
        </div>

        {/* Message Content */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '');
                const code = String(children).replace(/\n$/, '');

                if (match) {
                  return <CodeBlock code={code} language={match[1]} />;
                }

                return (
                  <code className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Actions */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Regenerate"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--accent-error)] hover:bg-[var(--bg-hover)] transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;