import { Card, CardContent, CardHeader } from '../components/Card';

export default function ApiDocs() {
  const endpoints = [
    {
      method: 'GET',
      path: '/test/all',
      desc: 'Retrieves all simulated notification events.',
      response: `[
  {
    "eventId": "evt_1a2b3c",
    "recipient": "user@example.com",
    "status": "DELIVERED",
    // ...
  }
]`
    },
    {
      method: 'GET',
      path: '/test/{eventId}',
      desc: 'Retrieves a single notification event by its ID.',
      response: `{
  "eventId": "evt_1a2b3c",
  "recipient": "user@example.com",
  "status": "DELIVERED",
  // ...
}`
    },
    {
      method: 'POST',
      path: '/test/publish',
      desc: 'Publishes a new test notification to the Kafka topic.',
      payload: `{
  "channel": "EMAIL",
  "priority": "HIGH",
  "eventType": "USER_SIGNUP",
  "recipient": "user@example.com"
}`
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">API Documentation</h2>
        <p className="text-textSecondary mt-1">REST API endpoints exposed by the Notiq Core Service.</p>
      </div>

      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center gap-4">
               <span className={`px-2 py-1 rounded text-xs font-bold ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                 {ep.method}
               </span>
               <code className="text-sm font-mono text-textPrimary">{ep.path}</code>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-textSecondary mb-4">{ep.desc}</p>
               {ep.payload && (
                 <div className="mb-4">
                   <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Request Payload</h4>
                   <pre className="bg-surface/50 border border-surface rounded-lg p-4 text-xs font-mono text-textSecondary overflow-x-auto">
                     {ep.payload}
                   </pre>
                 </div>
               )}
               {ep.response && (
                 <div>
                   <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Response Example</h4>
                   <pre className="bg-surface/50 border border-surface rounded-lg p-4 text-xs font-mono text-textSecondary overflow-x-auto">
                     {ep.response}
                   </pre>
                 </div>
               )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
