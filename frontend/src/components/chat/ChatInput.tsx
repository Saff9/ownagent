import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, X, FileText, Image, Mic, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { chatService } from '../../services/chat';
import { fileService } from '../../services/files';
import { Button } from '../common/Button';

interface ChatInputProps {
  conversationId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedProvider,
    selectedModel,
    addMessage,
    setStreamingMessage,
    appendStreamingToken,
    setStreamingMessageId,
    clearStreaming,
    addToast,
  } = useStore();

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    const fileIds: string[] = [];
    for (const file of files) {
      try {
        const response = await fileService.uploadFile(
          file,
          conversationId,
          (progress) => {
            setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
          }
        );
        fileIds.push(response.id);
      } catch (error) {
        addToast({
          type: 'error',
          message: `Failed to upload ${file.name}`,
        });
      }
    }
    return fileIds;
  };

  const handleSend = async () => {
    if (!message.trim() && files.length === 0) return;
    if (!selectedProvider || !selectedModel) {
      addToast({
        type: 'error',
        message: 'Please select a provider and model',
      });
      return;
    }

    const content = message.trim();
    setMessage('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Upload files first
      const fileIds = await uploadFiles();
      setFiles([]);
      setUploadProgress({});

      // Add user message to UI
      const userMessage = {
        id: `temp-${Date.now()}`,
        role: 'user' as const,
        content,
        created_at: new Date().toISOString(),
        file_ids: fileIds,
      };
      addMessage(userMessage);

      // Stream the response
      setStreamingMessage('');
      let fullResponse = '';

      await chatService.streamMessage(
        conversationId,
        {
          content,
          provider: selectedProvider,
          model: selectedModel,
          file_ids: fileIds,
        },
        {
          onStart: (data) => {
            setStreamingMessageId(data.message_id);
          },
          onToken: (data) => {
            fullResponse += data.token;
            appendStreamingToken(data.token);
          },
          onError: (data) => {
            addToast({
              type: 'error',
              message: data.error,
            });
            clearStreaming();
            setIsLoading(false);
          },
          onDone: () => {
            // Add the complete message to the store
            const assistantMessage = {
              id: `temp-assistant-${Date.now()}`,
              role: 'assistant' as const,
              content: fullResponse,
              created_at: new Date().toISOString(),
            };
            addMessage(assistantMessage);
            clearStreaming();
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Send error:', error);
      addToast({
        type: 'error',
        message: 'Failed to send message',
      });
      setIsLoading(false);
      clearStreaming();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-xl p-4">
      {/* File attachments */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-sm hover:border-[var(--accent-primary)]/50 transition-colors"
            >
              <span className="text-[var(--accent-primary)]">{getFileIcon(file)}</span>
              <span className="text-[var(--text-primary)] truncate max-w-[150px]">
                {file.name}
              </span>
              <span className="text-[var(--text-tertiary)] text-xs">
                {fileService.formatFileSize(file.size)}
              </span>
              {uploadProgress[file.name] !== undefined && (
                <div className="w-16 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${uploadProgress[file.name]}%` }}
                  />
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent-error)] hover:bg-[var(--accent-error)]/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div 
        className={`
          flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300
          ${isFocused 
            ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-lg shadow-violet-500/10' 
            : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-focus)]'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
          title="Attach files"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message GenZ Smart..."
            rows={1}
            className="w-full bg-transparent text-[var(--text-primary)] px-3 py-3 resize-none focus:outline-none placeholder:text-[var(--text-tertiary)]"
            disabled={isLoading}
          />
        </div>

        <button
          className="p-3 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/10 transition-all"
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          disabled={(!message.trim() && files.length === 0) || isLoading}
          className={`
            p-3 rounded-xl transition-all duration-300
            ${(message.trim() || files.length > 0) && !isLoading
              ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105' 
              : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'}
          `}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Provider indicator */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--text-tertiary)]">
        {selectedProvider && selectedModel ? (
          <>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
              Using <span className="text-[var(--accent-primary)] font-medium">{selectedProvider}</span>
              <span className="text-[var(--border-primary)]">/</span>
              <span className="text-[var(--text-secondary)]">{selectedModel}</span>
            </span>
            <span className="text-[var(--border-primary)]">•</span>
            <span>Shift + Enter for new line</span>
          </>
        ) : (
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[var(--accent-warning)]" />
            Select a provider to start chatting
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
