import axios from 'axios';
import type { NotificationModel, DashboardMetrics } from './types';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Mock data for offline/demo mode ──────────────────────

const mockNotifications: NotificationModel[] = [
  {
    eventId: 'evt_1a2b3c4d',
    recipient: 'user@example.com',
    correlationId: 'corr_9991',
    sourceService: 'user-service',
    channel: 'EMAIL',
    priority: 'HIGH',
    status: 'DELIVERED',
    retryCount: 0,
    eventType: 'USER_REGISTERED',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    eventId: 'evt_4d5e6f7g',
    recipient: 'admin@company.io',
    correlationId: 'corr_9992',
    sourceService: 'payment-service',
    channel: 'EMAIL',
    priority: 'HIGH',
    status: 'PROCESSING',
    retryCount: 1,
    eventType: 'PAYMENT_SUCCESS',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    eventId: 'evt_7g8h9i0j',
    recipient: 'billing@org.com',
    correlationId: 'corr_9993',
    sourceService: 'billing-service',
    channel: 'EMAIL',
    priority: 'MEDIUM',
    status: 'FAILED',
    retryCount: 3,
    eventType: 'INVOICE_GENERATED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86000000).toISOString(),
  },
  {
    eventId: 'evt_0j1k2l3m',
    recipient: 'ops@platform.dev',
    correlationId: 'corr_9994',
    sourceService: 'marketing-service',
    channel: 'EMAIL',
    priority: 'LOW',
    status: 'DLQ',
    retryCount: 3,
    eventType: 'PROMO_CAMPAIGN',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 170000000).toISOString(),
  },
  {
    eventId: 'evt_x9y8z7w6',
    recipient: 'alerts@infra.io',
    correlationId: 'corr_9995',
    sourceService: 'monitoring-service',
    channel: 'EMAIL',
    priority: 'HIGH',
    status: 'DELIVERED',
    retryCount: 0,
    eventType: 'SYSTEM_ALERT',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    eventId: 'evt_p3q4r5s6',
    recipient: 'support@helpdesk.com',
    correlationId: 'corr_9996',
    sourceService: 'ticket-service',
    channel: 'EMAIL',
    priority: 'MEDIUM',
    status: 'DISPATCHED',
    retryCount: 0,
    eventType: 'TICKET_CREATED',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 850000).toISOString(),
  },
  {
    eventId: 'evt_m7n8o9p0',
    recipient: 'devops@cloud.run',
    correlationId: 'corr_9997',
    sourceService: 'deploy-service',
    channel: 'EMAIL',
    priority: 'HIGH',
    status: 'RECEIVED',
    retryCount: 0,
    eventType: 'DEPLOY_COMPLETED',
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
];

// ── API functions ────────────────────────────────────────

export const api = {
  getAllNotifications: async (): Promise<NotificationModel[]> => {
    try {
      const response = await apiClient.get<NotificationModel[]>('/test/all');
      return response.data;
    } catch (error) {
      console.warn('Backend unreachable, using mock data.', error);
      return mockNotifications;
    }
  },

  getNotification: async (eventId: string): Promise<NotificationModel | null> => {
    try {
      const response = await apiClient.get<NotificationModel>(`/test/${eventId}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch notification ${eventId}.`, error);
      return mockNotifications.find((n) => n.eventId === eventId) || null;
    }
  },

  publishTestNotification: async (): Promise<string> => {
    // Backend's POST /test/publish takes no body — it creates a hardcoded test event
    const response = await apiClient.post<string>('/test/publish');
    return response.data;
  },

  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const all = await api.getAllNotifications();
      return {
        total: all.length,
        delivered: all.filter((n) => n.status === 'DELIVERED').length,
        processing: all.filter((n) => n.status === 'PROCESSING').length,
        failed: all.filter((n) => n.status === 'FAILED').length,
        dlq: all.filter((n) => n.status === 'DLQ').length,
        received: all.filter((n) => n.status === 'RECEIVED').length,
        dispatched: all.filter((n) => n.status === 'DISPATCHED').length,
      };
    } catch {
      return { total: 0, delivered: 0, processing: 0, failed: 0, dlq: 0, received: 0, dispatched: 0 };
    }
  },
};
