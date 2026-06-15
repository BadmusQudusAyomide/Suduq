import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { categories, imageTools, textTools, videoTools, searchTools } from '../lib/tool-registry';
import ToolCard from '../components/ToolCard';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useFavoritesTools } from '../hooks/useFavoritesTools';

const sections = [
  {
    key: 'images',
    title: 'Image Tools',
    description: 'Quick browser and backend-assisted image workflows.',
    items: imageTools
  },
  {
    key: 'text',
    title: 'Text Tools',
    description: 'Writing, formatting, hashing, and utility text workflows.',
    items: textTools
  },
  {
    key: 'video',
    title: 'Video Tools',
    description: 'Sectioned download-ready workflows for social media videos.',
    items: videoTools
  }
];

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const { favoriteTools, favoriteCount, isFavorite, toggleFavorite } = useFavoritesTools();

  const filteredSections = useMemo(() => {
    const visibleTools = searchTools(query);

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((tool) => visibleTools.some((item) => item.key === tool.key))
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const totalCount = filteredSections.reduce((count, section) => count + section.items.length, 0);
  const visibleFavorites = useMemo(() => {
    const visibleTools = searchTools(query);
    return favoriteTools.filter((tool) => visibleTools.some((item) => item.path === tool.path));
  }, [favoriteTools, query]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Badge className="w-fit">Suduq by Qudus</Badge>
              <CardTitle className="text-3xl">Pick a tool and get moving.</CardTitle>
              <CardDescription className="max-w-3xl text-base">
                Search across the tools you've already built and jump straight into the one you need.
              </CardDescription>
            </div>

            <div className="w-full max-w-md">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tools..."
                  className="pl-9"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {totalCount} tool{totalCount === 1 ? '' : 's'} visible
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {visibleFavorites.length ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Favorites</CardTitle>
                <CardDescription>Your starred tools, ready to open again.</CardDescription>
              </div>
              <Badge variant="secondary">{favoriteCount}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleFavorites.map((tool) => (
              <ToolCard
                key={tool.path}
                tool={tool}
                isFavorite={isFavorite(tool.path)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        {filteredSections.map((section) => {
          const category = categories.find((item) => item.key === section.key);
          const Icon = category?.icon;

          return (
            <Card key={section.key}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {Icon ? (
                    <span className="grid h-10 w-10 place-items-center rounded-md border bg-muted">
                      <Icon size={16} />
                    </span>
                  ) : null}
                  <div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {section.items.map((tool) => (
                  <ToolCard
                    key={tool.path}
                    tool={tool}
                    isFavorite={isFavorite(tool.path)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSections.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground">No tools match that search.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
