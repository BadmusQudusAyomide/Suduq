import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function ToolCard({ tool, isFavorite = false, onToggleFavorite }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <Link to={tool.path} className="min-w-0 flex-1">
            <div>
              <CardTitle className="text-base">{tool.label}</CardTitle>
              <CardDescription className="mt-1">{tool.description}</CardDescription>
            </div>
          </Link>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {onToggleFavorite ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onToggleFavorite(tool)}
                  aria-label={isFavorite ? `Remove ${tool.label} from favorites` : `Add ${tool.label} to favorites`}
                >
                  <Star className={isFavorite ? 'fill-current' : ''} size={16} />
                </Button>
              ) : null}
              <Badge variant={tool.execution === 'server' ? 'secondary' : 'outline'}>
                {tool.execution || 'client'}
              </Badge>
            </div>
            <Link
              to={tool.path}
              className="grid h-9 w-9 place-items-center rounded-md border bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
              aria-label={`Open ${tool.label}`}
            >
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">Open tool</p>
      </CardContent>
    </Card>
  );
}
