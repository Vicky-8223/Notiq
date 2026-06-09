import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an ISO date string to a human-readable form */
export function formatDate(date: string | undefined | null): string {
  if (!date) return 'N/A';
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  } catch {
    return 'Invalid date';
  }
}

/** Format a Date object to relative time (e.g. "3s ago", "2m ago") */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'Never';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/** Truncate a string (e.g. event IDs) for display */
export function truncateId(id: string, maxLen = 12): string {
  if (id.length <= maxLen) return id;
  return id.slice(0, maxLen) + '…';
}

/** Get a color class for a given status */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'DELIVERED': return 'text-success';
    case 'PROCESSING':
    case 'DISPATCHED': return 'text-primary';
    case 'RECEIVED': return 'text-blue-400';
    case 'FAILED': return 'text-error';
    case 'DLQ': return 'text-warning';
    default: return 'text-muted';
  }
}
