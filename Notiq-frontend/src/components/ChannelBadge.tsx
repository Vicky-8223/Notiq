import type { Channel } from '../api/types';
import { Mail, Phone, BellRing } from 'lucide-react';
import { cn } from '../lib/utils';

const channelConfig: Record<Channel, { icon: typeof Mail; label: string; color: string }> = {
  EMAIL: { icon: Mail, label: 'Email', color: 'text-primary' },
  SMS: { icon: Phone, label: 'SMS', color: 'text-success' },
  PUSH: { icon: BellRing, label: 'Push', color: 'text-warning' },
};

interface Props {
  channel: Channel;
  showLabel?: boolean;
  className?: string;
}

export function ChannelBadge({ channel, showLabel = true, className }: Props) {
  const c = channelConfig[channel];
  const Icon = c.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5', c.color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span className="text-[13px] font-medium">{c.label}</span>}
    </span>
  );
}
