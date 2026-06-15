import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="group block transition hover:-translate-y-0.5"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{tool.label}</CardTitle>
              <CardDescription className="mt-1">{tool.description}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={tool.execution === 'server' ? 'secondary' : 'outline'}>
                {tool.execution || 'client'}
              </Badge>
              <span className="grid h-9 w-9 place-items-center rounded-md border bg-muted text-muted-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Open tool</p>
        </CardContent>
      </Card>
    </Link>
  );
}
