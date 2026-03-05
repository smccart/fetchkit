import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Param {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}

interface EndpointBlockProps {
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  params?: Param[];
  curl?: string;
  fetch?: string;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="border rounded-lg bg-muted/30 p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
      <pre className="whitespace-pre-wrap">{children}</pre>
    </div>
  );
}

export default function EndpointBlock({ method, path, summary, params, curl, fetch: fetchExample }: EndpointBlockProps) {
  const methodColor = method === 'GET' ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10';

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${methodColor}`}>{method}</span>
        <code className="text-sm font-mono text-foreground">{path}</code>
      </div>
      <p className="text-sm text-muted-foreground">{summary}</p>

      {params && params.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-1.5 font-medium">Parameter</th>
                <th className="text-left px-3 py-1.5 font-medium">Type</th>
                <th className="text-left px-3 py-1.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {params.map((p) => (
                <tr key={p.name} className="border-b last:border-0">
                  <td className="px-3 py-1.5 font-mono text-xs text-foreground">
                    {p.name}{p.required && <span className="text-red-400 ml-0.5">*</span>}
                  </td>
                  <td className="px-3 py-1.5 text-xs">{p.type}</td>
                  <td className="px-3 py-1.5 text-xs">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {curl && fetchExample && (
        <Tabs defaultValue="curl">
          <TabsList>
            <TabsTrigger value="curl">curl</TabsTrigger>
            <TabsTrigger value="fetch">fetch</TabsTrigger>
          </TabsList>
          <TabsContent value="curl">
            <CodeBlock>{curl}</CodeBlock>
          </TabsContent>
          <TabsContent value="fetch">
            <CodeBlock>{fetchExample}</CodeBlock>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
