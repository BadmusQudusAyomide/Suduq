import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PanelsTopLeft, Menu, ChevronDown } from 'lucide-react';
import { categories, imageTools, textTools, videoTools } from '../lib/tool-registry';
import { useRecentTools } from '../hooks/useRecentTools';
import { useFavoritesTools } from '../hooks/useFavoritesTools';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';

function ToolLink({ tool, onClick, className = '' }) {
  return (
    <NavLink
      to={tool.path}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 text-sm transition-colors',
          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground',
          className
        ].join(' ')
      }
    >
      {tool.label}
    </NavLink>
  );
}

function CategoryLink({ category, onClick, className = '' }) {
  const Icon = category.icon;

  return (
    <NavLink
      to={`/tools/${category.key}`}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-start gap-3 rounded-md border px-3 py-3 text-sm transition-colors',
          isActive ? 'border-primary bg-primary/5' : 'hover:bg-accent hover:text-accent-foreground',
          className
        ].join(' ')
      }
    >
      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-md border bg-muted">
        <Icon size={15} />
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{category.label}</span>
        <span className="block text-xs text-muted-foreground">{category.description}</span>
      </span>
    </NavLink>
  );
}

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const recentTools = useRecentTools(location.pathname);
  const { favoriteTools } = useFavoritesTools();
  const [mobileOpen, setMobileOpen] = useState(false);
  const browseCategories = categories.filter((category) =>
    ['images', 'text', 'video', 'dev', 'utility', 'creators'].includes(category.key)
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-4 px-3 py-3 sm:px-4 lg:gap-6 lg:px-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Suduq logo"
                    className="h-10 w-10 rounded-md border object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">Suduq</CardTitle>
                    <CardDescription>Tools by Qudus</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardContent className="space-y-2 p-3">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                    ].join(' ')
                  }
                >
                  <PanelsTopLeft size={16} />
                  Dashboard
                </NavLink>
                <Separator />
                <div className="space-y-1">
                  <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Categories
                  </p>
                  {browseCategories.map((category) => (
                    <CategoryLink key={category.key} category={category} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Recent tools</CardTitle>
                <CardDescription>Your latest tool pages in one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {recentTools.length ? (
                  recentTools.map((tool) => <ToolLink key={tool.path} tool={tool} className="border" />)
                ) : (
                  <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                    Open a few tools and they'll show up here.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Favorites</CardTitle>
                <CardDescription>Your starred tools.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {favoriteTools.length ? (
                  favoriteTools.map((tool) => <ToolLink key={tool.path} tool={tool} className="border" />)
                ) : (
                  <div className="rounded-md border border-dashed px-3 py-4 text-sm text-muted-foreground">
                    Star a tool to keep it here.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Browse</CardTitle>
                <CardDescription>Open a category page to see every tool in that group.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {browseCategories.map((category) => (
                  <CategoryLink key={category.key} category={category} />
                ))}
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="rounded-xl border bg-card px-4 py-4 shadow-sm lg:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Browser utility suite
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Suduq, built for quick work.
                </h1>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Quick actions
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Jump to tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {imageTools.map((tool) => (
                      <DropdownMenuItem key={tool.path} onSelect={() => navigate(tool.path)}>
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {textTools.slice(0, 4).map((tool) => (
                      <DropdownMenuItem key={tool.path} onSelect={() => navigate(tool.path)}>
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {videoTools.map((tool) => (
                      <DropdownMenuItem key={tool.path} onSelect={() => navigate(tool.path)}>
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">About</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>About Suduq</DialogTitle>
                      <DialogDescription>
                        A fast utility workspace for image, text, dev, video, and everyday tools, built by
                        Qudus.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>- Frontend: React, Vite, Tailwind, shadcn-style components</p>
                      <p>- Backend: Express and Sharp</p>
                      <p>- First sprint: image utilities</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Menu size={16} />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[92vw] max-w-sm overflow-y-auto">
                  <SheetHeader>
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.png"
                        alt="Suduq logo"
                        className="h-9 w-9 rounded-md border object-cover"
                      />
                      <SheetTitle>Suduq</SheetTitle>
                    </div>
                    <SheetDescription>Navigate tools, recent items, favorites, and the current workspace.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <NavLink
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md border px-3 py-2 text-sm"
                    >
                      Dashboard
                    </NavLink>
                    <div className="space-y-2 pt-2">
                      {browseCategories.map((category) => (
                        <CategoryLink
                          key={category.key}
                          category={category}
                          onClick={() => setMobileOpen(false)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Recent tools
                      </p>
                      <div className="mt-2 space-y-2">
                        {recentTools.length ? (
                          recentTools.map((tool) => (
                            <NavLink
                              key={tool.path}
                              to={tool.path}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-md border px-3 py-2 text-sm"
                            >
                              {tool.label}
                            </NavLink>
                          ))
                        ) : (
                          <div className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
                            Open a few tools to see them here.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Favorites
                      </p>
                      <div className="mt-2 space-y-2">
                        {favoriteTools.length ? (
                          favoriteTools.map((tool) => (
                            <NavLink
                              key={tool.path}
                              to={tool.path}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-md border px-3 py-2 text-sm"
                            >
                              {tool.label}
                            </NavLink>
                          ))
                        ) : (
                          <div className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
                            Star a tool to keep it here.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {browseCategories.map((category) => (
                  <NavLink
                    key={category.key}
                    to={`/tools/${category.key}`}
                    className="shrink-0 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

