import type { Priority } from '../api/types';
import { cn } from '../lib/utils';

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  HIGH: { color: 'text-error', bg: 'bg-error/10' },
  MEDIUM: { color: 'text-warning', bg: 'bg-warning/10' },
  LOW: { color: 'text-muted', bg: 'bg-surface-light' },
};

interface Props {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: Props) {
  const c = priorityConfig[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold',
        c.color, c.bg,
        className,
      )}
    >
      {priority}
    </span>
  );
}
