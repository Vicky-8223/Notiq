import type { NotificationStatus } from '../api/types';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle, AlertCircle, Clock, Send, Radio, Inbox } from 'lucide-react';

const stateConfig: Record<NotificationStatus, { label: string; icon: typeof CheckCircle2; desc: string }> = {
  RECEIVED: { label: 'Received', icon: Inbox, desc: 'Event ingested by Core Service' },
  DISPATCHED: { label: 'Dispatched', icon: Send, desc: 'Routed to delivery channel' },
  PROCESSING: { label: 'Processing', icon: Radio, desc: 'Delivery attempt in progress' },
  DELIVERED: { label: 'Delivered', icon: CheckCircle2, desc: 'Successfully delivered to recipient' },
  FAILED: { label: 'Failed', icon: AlertCircle, desc: 'Delivery attempt failed' },
  DLQ: { label: 'Dead Letter Queue', icon: Clock, desc: 'Retries exhausted, moved to DLQ' },
};

const SUCCESS_PATH: NotificationStatus[] = ['RECEIVED', 'DISPATCHED', 'PROCESSING', 'DELIVERED'];
const FAILED_PATH: NotificationStatus[] = ['RECEIVED', 'DISPATCHED', 'PROCESSING', 'FAILED'];
const DLQ_PATH: NotificationStatus[] = ['RECEIVED', 'DISPATCHED', 'PROCESSING', 'FAILED', 'DLQ'];

interface Props {
  currentStatus: NotificationStatus;
  className?: string;
}

export function Timeline({ currentStatus, className }: Props) {
  const isErrorPath = ['FAILED', 'DLQ'].includes(currentStatus);
  const path = currentStatus === 'DLQ' ? DLQ_PATH : isErrorPath ? FAILED_PATH : SUCCESS_PATH;
  const currentIndex = path.indexOf(currentStatus);
  const activeIndex = currentIndex === -1 ? path.indexOf('PROCESSING') : currentIndex;

  return (
    <div className={cn('relative ml-1 space-y-0', className)}>
      {path.map((state, index) => {
        const isCompleted = index <= activeIndex;
        const isCurrent = index === activeIndex;
        const isError = ['FAILED', 'DLQ'].includes(state);
        const config = stateConfig[state];
        const Icon = config.icon;
        const isLast = index === path.length - 1;

        return (
          <div key={state} className="relative flex gap-4">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[15px] top-[32px] w-[2px]',
                  isCompleted && index < activeIndex
                    ? isError ? 'bg-error/40' : 'bg-success/40'
                    : 'bg-border',
                )}
                style={{ height: 'calc(100% - 16px)' }}
              />
            )}

            {/* Node */}
            <div className="relative z-10 flex-shrink-0 pt-1">
              <div
                className={cn(
                  'flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted
                    ? isError
                      ? 'border-error bg-error/10'
                      : 'border-success bg-success/10'
                    : 'border-border bg-background',
                  isCurrent && !isError && 'ring-[3px] ring-success/20',
                  isCurrent && isError && 'ring-[3px] ring-error/20',
                )}
              >
                {isCompleted ? (
                  isError ? (
                    <AlertCircle className="h-3.5 w-3.5 text-error" />
                  ) : (
                    <Icon className="h-3.5 w-3.5 text-success" />
                  )
                ) : (
                  <Circle className="h-3 w-3 text-muted/30" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h4
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCompleted ? 'text-foreground' : 'text-muted/50',
                )}
              >
                {config.label}
              </h4>
              <p className="mt-0.5 text-xs text-muted">
                {isCurrent ? 'Current status' : isCompleted ? config.desc : 'Pending'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
