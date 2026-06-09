import { cn } from '../lib/utils';

type Variant = 'metric' | 'table-row' | 'card' | 'detail';

interface Props {
  variant?: Variant;
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className }: Props) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'metric') {
    return (
      <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5', className)}>
        {items.map((i) => (
          <div key={i} className="h-[88px] rounded-xl border border-border skeleton-shimmer" />
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={cn('space-y-0', className)}>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4">
            <div className="h-4 w-24 rounded skeleton-shimmer" />
            <div className="h-4 w-32 rounded skeleton-shimmer" />
            <div className="h-4 w-16 rounded skeleton-shimmer" />
            <div className="ml-auto h-5 w-20 rounded-full skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="h-8 w-64 rounded skeleton-shimmer" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 h-80 rounded-xl border border-border skeleton-shimmer" />
          <div className="h-80 rounded-xl border border-border skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((i) => (
        <div key={i} className="h-48 rounded-xl border border-border skeleton-shimmer" />
      ))}
    </div>
  );
}
