import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from './client';
import type { NotificationModel, DashboardMetrics } from './types';

interface FetchOptions {
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds. Default: 30000 (30s) */
  interval?: number;
}

// ── useNotifications ─────────────────────────────────────

interface UseNotificationsReturn {
  notifications: NotificationModel[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useNotifications(options: FetchOptions = {}): UseNotificationsReturn {
  const { autoRefresh = false, interval = 30000 } = options;
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await api.getAllNotifications();
      if (mountedRef.current) {
        setNotifications(data);
        setLastUpdated(new Date());
      }
    } catch {
      if (mountedRef.current) {
        setError('Failed to fetch notifications');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchData(true), interval);
    return () => clearInterval(id);
  }, [autoRefresh, interval, fetchData]);

  return { notifications, loading, refreshing, error, lastUpdated, refresh: () => fetchData(true) };
}

// ── useNotification (single) ─────────────────────────────

interface UseNotificationReturn {
  notification: NotificationModel | null;
  loading: boolean;
  error: string | null;
}

export function useNotification(eventId: string | undefined): UseNotificationReturn {
  const [notification, setNotification] = useState<NotificationModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getNotification(eventId!);
        if (!cancelled) setNotification(data);
      } catch {
        if (!cancelled) setError('Failed to fetch notification');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [eventId]);

  return { notification, loading, error };
}

// ── useDashboardData ─────────────────────────────────────

interface UseDashboardReturn {
  metrics: DashboardMetrics | null;
  notifications: NotificationModel[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useDashboardData(options: FetchOptions = {}): UseDashboardReturn {
  const { autoRefresh = false, interval = 30000 } = options;
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [m, all] = await Promise.all([
        api.getDashboardMetrics(),
        api.getAllNotifications(),
      ]);

      if (mountedRef.current) {
        setMetrics(m);
        const sorted = [...all].sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        setNotifications(sorted);
        setLastUpdated(new Date());
      }
    } catch {
      if (mountedRef.current) {
        setError('Failed to load dashboard data');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchData(true), interval);
    return () => clearInterval(id);
  }, [autoRefresh, interval, fetchData]);

  return { metrics, notifications, loading, refreshing, error, lastUpdated, refresh: () => fetchData(true) };
}

// ── usePublishNotification ───────────────────────────────

interface UsePublishReturn {
  publish: () => Promise<void>;
  publishing: boolean;
  result: { type: 'success' | 'error'; message: string } | null;
  clearResult: () => void;
}

export function usePublishNotification(): UsePublishReturn {
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const publish = async () => {
    setPublishing(true);
    setResult(null);
    try {
      await api.publishTestNotification();
      setResult({ type: 'success', message: 'Notification published successfully. Check the Notifications page to track it.' });
    } catch {
      setResult({ type: 'error', message: 'Failed to publish notification. Is the backend running?' });
    } finally {
      setPublishing(false);
    }
  };

  const clearResult = () => setResult(null);

  return { publish, publishing, result, clearResult };
}
