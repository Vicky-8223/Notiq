import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Target, Layers, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">About Notiq</h2>
        <p className="text-textSecondary mt-1">Distributed Notification Platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Project Motivation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-textSecondary leading-relaxed">
            Notiq is a distributed notification platform built using event-driven architecture principles. The platform demonstrates reliable notification delivery using Apache Kafka, Spring Boot, PostgreSQL, retry orchestration, dead letter queue processing, idempotency protection, and delivery tracking.
          </p>
          <p className="text-sm text-textSecondary leading-relaxed mt-4">
            This observability dashboard connects to the Notiq backend to provide real-time visibility into message throughput, failure rates, and individual message lifecycle tracking.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5 text-success" /> Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-textSecondary list-disc list-inside">
              <li>Event-Driven Architecture</li>
              <li>Apache Kafka Messaging</li>
              <li>Retry Mechanism & Exponential Backoff</li>
              <li>Dead Letter Queue (DLQ) processing</li>
              <li>Delivery Tracking & Observability Dashboard</li>
              <li>Microservices Separation</li>
              <li>Real Gmail SMTP Integration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5 text-warning" /> Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-textPrimary mb-2">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'TailwindCSS', 'Vite', 'Axios', 'Recharts'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-surface border border-surface/50 text-xs font-medium text-textSecondary">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-textPrimary mb-2 mt-4">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {['Java 21', 'Spring Boot', 'Spring Kafka', 'Spring Data JPA'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-surface border border-surface/50 text-xs font-medium text-textSecondary">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-textPrimary mb-2 mt-4">Infrastructure</h4>
                <div className="flex flex-wrap gap-2">
                  {['Apache Kafka', 'PostgreSQL', 'Docker'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-md bg-surface border border-surface/50 text-xs font-medium text-textSecondary">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
