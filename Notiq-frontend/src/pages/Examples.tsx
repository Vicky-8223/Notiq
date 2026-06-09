import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { api } from '../api/client';
import { Play, CheckCircle2, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';


export default function Examples() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{type: 'success'|'error', message: string} | null>(null);

  const handleTrigger = async (type: string) => {
    setLoading(type);
    setResult(null);
    try {
      await api.publishTestNotification();
      setResult({ type: 'success', message: `Successfully triggered ${type} scenario.` });
    } catch (error) {
      setResult({ type: 'error', message: `Failed to trigger ${type} scenario. Backend might be unreachable.` });
    } finally {
      setLoading(null);
    }
  };

  const scenarios = [
    {
      id: 'success',
      title: 'Successful Delivery',
      description: 'Simulates a standard notification flow that is processed and delivered successfully on the first attempt.',
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      payload: { channel: 'EMAIL' as const, priority: 'HIGH' as const, eventType: 'TEST_SUCCESS', recipient: 'test@example.com' }
    },
    {
      id: 'retry',
      title: 'Retry Recovery',
      description: 'Simulates a transient failure where the notification fails initially but recovers after one or more retry attempts.',
      icon: RefreshCw,
      color: 'text-primary',
      bg: 'bg-primary/10',
      payload: { channel: 'SMS' as const, priority: 'MEDIUM' as const, eventType: 'TEST_RETRY', recipient: '+1234567890' }
    },
    {
      id: 'dlq',
      title: 'Dead Letter Queue (DLQ)',
      description: 'Simulates a persistent failure where all retry attempts are exhausted, and the message is routed to the DLQ.',
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
      payload: { channel: 'PUSH' as const, priority: 'LOW' as const, eventType: 'TEST_DLQ', recipient: 'device_token_xyz' }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">Interactive Examples</h2>
        <p className="text-textSecondary mt-1">Trigger test scenarios to observe how Notiq handles different notification lifecycles.</p>
      </div>

      {result && (
        <div className={`p-4 rounded-lg border ${result.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'} flex items-center gap-3`}>
           {result.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
           <p className="text-sm font-medium">{result.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <Card key={scenario.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${scenario.bg} ${scenario.color}`}>
                     <Icon className="h-5 w-5" />
                   </div>
                   <CardTitle>{scenario.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-textSecondary mb-6 flex-1">{scenario.description}</p>
                <div className="bg-surface/50 rounded p-3 mb-6 font-mono text-xs text-textSecondary overflow-x-auto border border-surface">
                   <pre>{JSON.stringify(scenario.payload, null, 2)}</pre>
                </div>
                <button
                  onClick={() => handleTrigger(scenario.title)}
                  disabled={loading !== null}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === scenario.title ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {loading === scenario.title ? 'Publishing...' : 'Trigger Scenario'}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
