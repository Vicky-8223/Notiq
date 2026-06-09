import type { NotificationStatus } from '../api/types';
import { cn } from '../lib/utils';

const config: Record<NotificationStatus, { bg: string; text: string; border: string; dot?: boolean }> = {
  RECEIVED: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  DISPATCHED: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  PROCESSING: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', dot: true },
  DELIVERED: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  FAILED: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
  DLQ: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
};

interface Props {
  status: NotificationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const c = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        c.bg, c.text, c.border,
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
      )}
    >
      {c.dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {status}
    </span>
  );
}
