import type { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface Props {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string; // e.g. 'text-primary'
  glowClass?: string; // e.g. 'glow-primary'
  className?: string;
}

export function MetricCard({ title, value, icon, color, glowClass, className }: Props) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border border-border bg-surface p-5',
        'transition-all duration-300 hover:-translate-y-0.5',
        glowClass && `hover:${glowClass}`,
        className,
      )}
    >
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
          'border border-border bg-background transition-colors duration-200',
          color,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-muted">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}
