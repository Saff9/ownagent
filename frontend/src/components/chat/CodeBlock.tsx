import React, { useEffect, useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';

// Import Prism languages
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current && language) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const normalizedLanguage = language?.toLowerCase() || 'text';

  return (
    <div className="relative group my-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] border-b-0 rounded-t-lg">
        <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase">
          {normalizedLanguage}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--accent-success)]" />
              <span className="text-[var(--accent-success)]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="!mt-0 !rounded-t-none !border-t-0">
        <code
          ref={codeRef}
          className={`language-${normalizedLanguage}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;