import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { MessageBubble } from './MessageBubble';
import { Sparkles } from 'lucide-react';

export const MessageList: React.FC = () => {
  const { messages, streamingMessage, streamingMessageId, isLoading } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  if (messages.length === 0 && !streamingMessage) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Welcome to GenZ Smart
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md">
            Start a conversation by typing a message below. I can help you with
            coding, writing, analysis, and much more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.id}-${index}`} message={message} />
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <MessageBubble
            message={{
              id: streamingMessageId || 'streaming',
              role: 'assistant',
              content: streamingMessage,
              created_at: new Date().toISOString(),
            }}
            isStreaming={isLoading}
          />
        )}

        {/* Typing indicator */}
        {isLoading && !streamingMessage && (
          <div className="flex gap-4 px-4 py-6 bg-[var(--bg-secondary)]/50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;