import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { categories, getToolsByCategory } from '../lib/tool-registry';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const categoryPaths = {
  images: '/tools/images',
  text: '/tools/text',
  video: '/tools/video',
  creators: '/tools/creators',
  dev: '/tools/dev'
};

export default function Dashboard() {
  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-background via-background to-muted/30">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <Badge className="w-fit">Suduq by Qudus</Badge>
                <CardTitle className="text-3xl">One glance, three workspaces.</CardTitle>
                <CardDescription className="max-w-2xl text-base">
                  Start with a category, then open the exact tool you need from its dedicated page.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search size={16} />
                Category-first navigation
              </div>
            </div>
          </CardHeader>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {categories
          .filter((category) => categoryPaths[category.key])
          .map((category) => {
            const Icon = category.icon;
            const toolCount = getToolsByCategory(category.key).length;

            return (
              <Card key={category.key} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl border bg-muted">
                        <Icon size={18} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.label}</CardTitle>
                        <CardDescription className="mt-1">{category.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{toolCount} tools</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">Open the full list for this workspace.</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to={categoryPaths[category.key]}>
                      Open
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
