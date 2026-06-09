export type Channel = 'EMAIL' | 'SMS' | 'PUSH';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type NotificationStatus = 'RECEIVED' | 'DISPATCHED' | 'PROCESSING' | 'DELIVERED' | 'FAILED' | 'DLQ';

export interface NotificationModel {
  eventId: string;
  recipient: string;
  correlationId: string;
  sourceService: string;
  channel: Channel;
  priority: Priority;
  status: NotificationStatus;
  retryCount: number;
  eventType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardMetrics {
  total: number;
  delivered: number;
  processing: number;
  failed: number;
  dlq: number;
  received: number;
  dispatched: number;
}

export const ALL_STATUSES: NotificationStatus[] = [
  'RECEIVED', 'DISPATCHED', 'PROCESSING', 'DELIVERED', 'FAILED', 'DLQ',
];

export const ALL_CHANNELS: Channel[] = ['EMAIL', 'SMS', 'PUSH'];

export const ALL_PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];
