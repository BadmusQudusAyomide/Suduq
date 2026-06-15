import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { PanelsTopLeft, Menu, ChevronDown } from 'lucide-react';
import { categories, imageTools, textTools } from '../lib/tool-registry';
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

export default function AppShell() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-6">
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
                    Quick access
                  </p>
                  {imageTools.map((tool) => (
                    <NavLink
                      key={tool.key}
                      to={tool.path}
                      className={({ isActive }) =>
                        [
                          'block rounded-md px-3 py-2 text-sm transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                        ].join(' ')
                      }
                    >
                      {tool.label}
                    </NavLink>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Text tools
                  </p>
                  {textTools.slice(0, 4).map((tool) => (
                    <NavLink
                      key={tool.key}
                      to={tool.path}
                      className={({ isActive }) =>
                        [
                          'block rounded-md px-3 py-2 text-sm transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'
                        ].join(' ')
                      }
                    >
                      {tool.label}
                    </NavLink>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Tool Groups</CardTitle>
                <CardDescription>Planned sections for the wider product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div key={category.key} className="flex items-start gap-3 rounded-md border p-3">
                      <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-md border bg-muted">
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{category.label}</p>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="rounded-xl border bg-card px-4 py-4 shadow-sm lg:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Browser utility suite
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Suduq, built for quick work.</h1>
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
                      <DropdownMenuItem key={tool.key} onSelect={() => navigate(tool.path)}>
                        {tool.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    {textTools.slice(0, 4).map((tool) => (
                      <DropdownMenuItem key={tool.key} onSelect={() => navigate(tool.path)}>
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
                        A fast utility workspace for image, text, dev, AI, and everyday tools, built by
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
                  <Button variant="outline" size="sm">
                    <Menu size={16} />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.png"
                        alt="Suduq logo"
                        className="h-9 w-9 rounded-md border object-cover"
                      />
                      <SheetTitle>Suduq</SheetTitle>
                    </div>
                    <SheetDescription>Navigate the current workspace and image tools.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <NavLink
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md border px-3 py-2 text-sm"
                    >
                      Dashboard
                    </NavLink>
                    {imageTools.map((tool) => (
                      <NavLink
                        key={tool.key}
                        to={tool.path}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md border px-3 py-2 text-sm"
                      >
                        {tool.label}
                      </NavLink>
                    ))}
                    {textTools.slice(0, 4).map((tool) => (
                      <NavLink
                        key={tool.key}
                        to={tool.path}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md border px-3 py-2 text-sm"
                      >
                        {tool.label}
                      </NavLink>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {imageTools.map((tool) => (
                  <NavLink
                    key={tool.key}
                    to={tool.path}
                    className="shrink-0 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {tool.label}
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
