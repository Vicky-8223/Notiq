import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { MonitorSmartphone, Server, Database, MessageSquare, Send, Mail } from 'lucide-react';

export default function Architecture() {
  const components = [
    { name: 'Client App', icon: MonitorSmartphone, desc: 'Triggers notification requests via REST API', color: 'text-primary' },
    { name: 'Core Service', icon: Server, desc: 'Spring Boot backend handling initial request, auth, and validation', color: 'text-blue-400' },
    { name: 'PostgreSQL', icon: Database, desc: 'Persists notification metadata and tracks lifecycle states', color: 'text-indigo-400' },
    { name: 'Kafka', icon: MessageSquare, desc: 'Event broker. Queues messages for asynchronous processing', color: 'text-success' },
    { name: 'Dispatcher', icon: Send, desc: 'Consumes Kafka topics and routes to appropriate delivery service', color: 'text-warning' },
    { name: 'Provider', icon: Mail, desc: 'External integrations for actual message delivery (e.g. Gmail SMTP)', color: 'text-error' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">System Architecture</h2>
        <p className="text-textSecondary mt-1">High-level overview of the Notiq event-driven notification flow.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Flow Diagram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto overflow-x-auto pb-8">
            {components.map((comp, index) => {
              const Icon = comp.icon;
              return (
                <div key={comp.name} className="flex flex-col md:flex-row items-center gap-4 group cursor-default min-w-[120px]">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 rounded-2xl bg-surface border border-surface/50 shadow-sm flex items-center justify-center group-hover:-translate-y-1 group-hover:shadow-[0_0_15px_rgba(79,140,255,0.2)] transition-all duration-300">
                      <Icon className={`h-8 w-8 ${comp.color}`} />
                    </div>
                    <span className="mt-3 text-sm font-medium text-textPrimary text-center w-24">{comp.name}</span>
                  </div>
                  {index < components.length - 1 && (
                    <div className="hidden md:block w-8 h-0.5 bg-surface/80 relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-surface/80 transform rotate-45"></div>
                    </div>
                  )}
                  {index < components.length - 1 && (
                    <div className="md:hidden h-8 w-0.5 bg-surface/80 relative my-2">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-surface/80 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle>Service Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
               <ul className="space-y-4">
                  {components.map(comp => (
                     <li key={comp.name} className="flex items-start gap-3">
                        <div className={`mt-0.5 ${comp.color}`}>
                           <comp.icon className="h-5 w-5" />
                        </div>
                        <div>
                           <h4 className="text-sm font-medium text-textPrimary">{comp.name}</h4>
                           <p className="text-sm text-textSecondary">{comp.desc}</p>
                        </div>
                     </li>
                  ))}
               </ul>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Kafka Event Flow</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4 text-sm text-textSecondary">
                  <p>
                     <strong className="text-textPrimary">1. Publish:</strong> The Core Service publishes a <code className="bg-surface px-1.5 py-0.5 rounded text-primary border border-surface/50">NotificationRequestedEvent</code> to the <code className="bg-surface px-1.5 py-0.5 rounded text-textPrimary border border-surface/50">notifications.pending</code> topic.
                  </p>
                  <p>
                     <strong className="text-textPrimary">2. Consume:</strong> The Dispatcher service consumes from the topic. It handles retry logic using exponential backoff if a transient error occurs during delivery.
                  </p>
                  <p>
                     <strong className="text-textPrimary">3. Dead Letter Queue:</strong> If the message fails processing after a configured number of retries, it is routed to the <code className="bg-surface px-1.5 py-0.5 rounded text-warning border border-surface/50">notifications.dlq</code> topic.
                  </p>
                  <p>
                     <strong className="text-textPrimary">4. Status Updates:</strong> The Dispatcher emits <code className="bg-surface px-1.5 py-0.5 rounded text-success border border-surface/50">NotificationStatusEvent</code> messages back to Kafka, which the Core Service consumes to update PostgreSQL.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
