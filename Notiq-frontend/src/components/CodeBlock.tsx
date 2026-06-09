import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'json', className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group relative rounded-lg border border-border bg-background', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted transition-colors hover:bg-surface-light hover:text-foreground"
          type="button"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-muted font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}
