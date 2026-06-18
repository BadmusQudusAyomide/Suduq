import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import ToolCard from '../components/ToolCard';
import { categories, getToolsByCategory } from '../lib/tool-registry';

const categoryPaths = {
  images: '/tools/images',
  text: '/tools/text',
  video: '/tools/video',
  creators: '/tools/creators',
  dev: '/tools/dev',
  utility: '/tools/utility'
};

export default function CategoryPage({ categoryKey }) {
  const category = categories.find((item) => item.key === categoryKey);
  const tools = getToolsByCategory(categoryKey);
  const Icon = category?.icon;
  const firstTool = tools[0];

  if (!category) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border bg-muted">
                  <Icon size={18} />
                </span>
                <div>
                  <Badge className="w-fit" variant="secondary">
                    {tools.length} tools
                  </Badge>
                  <CardTitle className="mt-2 text-3xl">{category.label}</CardTitle>
                </div>
              </div>
              <CardDescription className="max-w-3xl text-base">{category.description}</CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft size={16} />
                  Back to dashboard
                </Link>
              </Button>
              {firstTool ? (
                <Button asChild>
                  <Link to={firstTool.path}>
                    Open first tool
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.path} tool={tool} />
          ))}
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to use</CardTitle>
              <CardDescription>
                Pick a tool from this category, then use the dedicated page for the task.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Search size={16} />
                Browse all tools at once in this category.
              </p>
              <p>Each tool opens its own page and keeps the UI focused.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category links</CardTitle>
              <CardDescription>Jump to another workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(categoryPaths).map(([key, path]) => {
                const entry = categories.find((item) => item.key === key);

                return (
                  <Button
                    key={key}
                    asChild
                    variant={key === categoryKey ? 'secondary' : 'outline'}
                    className="w-full justify-between"
                  >
                    <Link to={path}>
                      {entry?.label}
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
