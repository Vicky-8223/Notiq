import { useDashboardData } from '../api/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { ChannelBadge } from '../components/ChannelBadge';
import { truncateId, formatRelativeTime } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Send, CheckCircle2, Clock, AlertCircle, Inbox, ArrowRight, Activity, BellOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { metrics, notifications, loading, error } = useDashboardData({ autoRefresh: true, interval: 15000 });
  const navigate = useNavigate();

  if (loading && !metrics) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-48 rounded skeleton-shimmer" />
          <div className="h-4 w-72 rounded skeleton-shimmer" />
        </div>
        <LoadingSkeleton variant="metric" count={5} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LoadingSkeleton variant="card" className="lg:col-span-2" />
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-10 w-10 text-error" />}
        title="Failed to load dashboard"
        description={error}
      />
    );
  }

  const pieData = [
    { name: 'Delivered', value: metrics?.delivered || 0, color: '#22C55E' },
    { name: 'Processing', value: metrics?.processing || 0, color: '#4F8CFF' },
    { name: 'Failed', value: metrics?.failed || 0, color: '#EF4444' },
    { name: 'DLQ', value: metrics?.dlq || 0, color: '#F59E0B' },
  ].filter((d) => d.value > 0);

  const recentList = notifications.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Platform Overview</h2>
          <p className="mt-1 text-sm text-muted">Real-time observability into the Notiq event-driven flow.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Events"
          value={metrics?.total || 0}
          icon={<Inbox className="h-5 w-5" />}
          color="text-foreground"
          className="stagger-1"
        />
        <MetricCard
          title="Delivered"
          value={metrics?.delivered || 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="text-success"
          glowClass="glow-success"
          className="stagger-2"
        />
        <MetricCard
          title="Processing"
          value={metrics?.processing || 0}
          icon={<Activity className="h-5 w-5" />}
          color="text-primary"
          glowClass="glow-primary"
          className="stagger-3"
        />
        <MetricCard
          title="Failed"
          value={metrics?.failed || 0}
          icon={<AlertCircle className="h-5 w-5" />}
          color="text-error"
          glowClass="glow-error"
          className="stagger-4"
        />
        <MetricCard
          title="Dead Letter Queue"
          value={metrics?.dlq || 0}
          icon={<Clock className="h-5 w-5" />}
          color="text-warning"
          glowClass="glow-warning"
          className="stagger-5"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 stagger-2">
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle>Recent Activity</CardTitle>
            <Link to="/notifications" className="group flex items-center text-xs font-medium text-primary hover:text-primary-hover">
              View all <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            {recentList.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-light text-muted">
                  <tr>
                    <th className="px-6 py-2.5 font-medium">Event ID</th>
                    <th className="px-6 py-2.5 font-medium">Channel</th>
                    <th className="px-6 py-2.5 font-medium">Recipient</th>
                    <th className="px-6 py-2.5 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentList.map((n) => (
                    <tr 
                      key={n.eventId} 
                      onClick={() => navigate(`/notifications/${n.eventId}`)}
                      className="group cursor-pointer hover:bg-surface-light/50 transition-colors"
                    >
                      <td className="px-6 py-3 font-mono text-[11px] text-muted group-hover:text-primary transition-colors">
                        {truncateId(n.eventId)}
                      </td>
                      <td className="px-6 py-3">
                        <ChannelBadge channel={n.channel} />
                      </td>
                      <td className="px-6 py-3 text-muted-foreground group-hover:text-foreground transition-colors">
                        {n.recipient}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <StatusBadge status={n.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState 
                icon={<BellOff className="h-8 w-8" />}
                title="No events yet"
                description="Trigger a test event from the Examples page."
                className="py-12"
              />
            )}
          </div>
        </Card>

        <Card className="stagger-3">
          <CardHeader className="py-4">
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex h-[320px] items-center justify-center p-0">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-surface-light)', 
                      borderColor: 'var(--color-border)', 
                      borderRadius: '8px',
                      color: 'var(--color-foreground)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    itemStyle={{ color: 'var(--color-foreground)', fontSize: '13px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', color: 'var(--color-muted)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState 
                icon={<Activity className="h-8 w-8" />}
                title="No data available"
                className="py-12"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
