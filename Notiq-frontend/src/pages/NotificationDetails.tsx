import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { api } from '../api/client';
import type { NotificationModel, NotificationStatus } from '../api/types';
import { StatusBadge } from '../components/StatusBadge';
import { ArrowLeft, Clock, Server, Tag, Hash, Calendar, CheckCircle2, Circle, Mail, AlertCircle, Phone, BellRing } from 'lucide-react';
import { clsx } from 'clsx';

const ALL_STATES: NotificationStatus[] = ['RECEIVED', 'DISPATCHED', 'PROCESSING', 'DELIVERED'];
const FAILED_STATES: NotificationStatus[] = ['RECEIVED', 'DISPATCHED', 'PROCESSING', 'FAILED', 'DLQ'];

export default function NotificationDetails() {
  const { eventId } = useParams<{ eventId: string }>();
  const [notification, setNotification] = useState<NotificationModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (eventId) {
        try {
          const data = await api.getNotification(eventId);
          setNotification(data);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [eventId]);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-surface rounded"></div>
      <div className="h-[400px] bg-surface rounded-xl"></div>
    </div>;
  }

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-textSecondary">
         <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
         <h3 className="text-lg font-medium text-textPrimary">Notification Not Found</h3>
         <p className="mt-1">The requested event ID could not be found.</p>
         <Link to="/notifications" className="mt-4 text-primary hover:underline flex items-center gap-2">
           <ArrowLeft className="h-4 w-4" /> Back to notifications
         </Link>
      </div>
    );
  }

  const isFailedPath = ['FAILED', 'DLQ'].includes(notification.status);
  const statesToRender = isFailedPath ? FAILED_STATES : ALL_STATES;
  const currentIndex = statesToRender.indexOf(notification.status);
  
  // Handle case where status might be PROCESSING and it's on the success path
  const activeIndex = currentIndex === -1 ? statesToRender.indexOf('PROCESSING') : currentIndex;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'EMAIL': return Mail;
      case 'SMS': return Phone;
      case 'PUSH': return BellRing;
      default: return Mail;
    }
  };

  const ChannelIcon = getChannelIcon(notification.channel);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/notifications" className="text-sm text-textSecondary hover:text-textPrimary flex items-center gap-1 mb-2 transition-colors">
             <ArrowLeft className="h-4 w-4" /> Back to Notifications
          </Link>
          <div className="flex items-center gap-3">
             <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Notification Details</h2>
             <StatusBadge status={notification.status} />
          </div>
          <p className="text-textSecondary mt-1 font-mono text-sm">{notification.eventId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Metadata View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><Hash className="h-3 w-3" /> Correlation ID</div>
                  <div className="font-mono text-sm text-textPrimary">{notification.correlationId}</div>
                </div>
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><Server className="h-3 w-3" /> Source Service</div>
                  <div className="font-medium text-sm text-textPrimary">{notification.sourceService}</div>
                </div>
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><Tag className="h-3 w-3" /> Event Type</div>
                  <div className="font-medium text-sm text-textPrimary">{notification.eventType}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><ChannelIcon className="h-3 w-3" /> Recipient ({notification.channel})</div>
                  <div className="font-medium text-sm text-textPrimary">{notification.recipient}</div>
                </div>
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><AlertCircle className="h-3 w-3" /> Priority</div>
                  <div className={clsx(
                     "font-medium text-sm",
                     notification.priority === 'HIGH' ? 'text-error' : notification.priority === 'MEDIUM' ? 'text-warning' : 'text-textPrimary'
                  )}>
                     {notification.priority}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-textSecondary flex items-center gap-1 mb-1"><Calendar className="h-3 w-3" /> Created At</div>
                  <div className="font-medium text-sm text-textPrimary">
                     {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            {(notification.retryCount > 0 || ['FAILED', 'DLQ'].includes(notification.status)) && (
              <div className="mt-8 pt-6 border-t border-surface/50">
                 <h4 className="text-sm font-medium text-textPrimary mb-4">Retry Information</h4>
                 <div className="bg-surface/50 border border-warning/20 rounded-lg p-4 flex items-center gap-4">
                    <div className="p-2 bg-warning/10 text-warning rounded-full">
                       <Clock className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-sm font-medium text-textPrimary">Retry Attempts: {notification.retryCount}</p>
                       <p className="text-xs text-textSecondary mt-0.5">
                         {notification.status === 'DLQ' 
                           ? "Maximum retries exhausted. Moved to Dead Letter Queue." 
                           : notification.status === 'FAILED' 
                             ? "Delivery failed. Will retry according to backoff policy." 
                             : "Recovered after retries."}
                       </p>
                    </div>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifecycle Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative border-l border-surface/50 ml-3 space-y-8 mt-2 pb-4">
              {statesToRender.map((state, index) => {
                const isCompleted = index <= activeIndex;
                const isCurrent = index === activeIndex;
                const isErrorState = ['FAILED', 'DLQ'].includes(state);
                
                return (
                  <div key={state} className="relative pl-6">
                    <div className={clsx(
                      "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 bg-background flex items-center justify-center transition-colors duration-300",
                      isCompleted 
                        ? (isErrorState ? "border-error" : "border-success") 
                        : "border-surface/50",
                      isCurrent && !isErrorState && "ring-4 ring-success/20",
                      isCurrent && isErrorState && "ring-4 ring-error/20"
                    )}>
                      {isCompleted && !isErrorState && <CheckCircle2 className="h-2.5 w-2.5 text-success" />}
                      {isCompleted && isErrorState && <AlertCircle className="h-2.5 w-2.5 text-error" />}
                      {!isCompleted && <Circle className="h-2.5 w-2.5 text-surface/50" />}
                    </div>
                    <div>
                      <h4 className={clsx(
                        "text-sm font-medium transition-colors",
                        isCompleted ? "text-textPrimary" : "text-textSecondary"
                      )}>
                        {state}
                      </h4>
                      <p className="text-xs text-textSecondary mt-1">
                        {isCurrent && "Current status"}
                        {isCompleted && !isCurrent && "Completed"}
                        {!isCompleted && "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
