import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import SearchDialog from '@/components/search-dialog';
import {
  Home,
  Settings,
  Code,
  Waypoints,
  CircleUser,
  Menu,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeSwitcher } from '@/components/theme-switcher';
import trimString from '@/lib/utils/trimString';
import { db } from '@/lib/drizzle/drizzleClient';
import { post, thread, topic } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Code: Code,
  Waypoints: Waypoints,
  // Add more icon mappings here
};

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "pd's blog",
  description: 'Blog about tech, coding, learning, business and life.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topics = await db.query.topic.findMany();
  const threads = await db.query.thread.findMany();
  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      slug: post.slug,
      threadTitle: thread.title,
      threadSlug: thread.slug,
      topicTitle: topic.title,
      topicSlug: topic.slug,
    })
    .from(post)
    .innerJoin(thread, eq(post.threadId, thread.id))
    .innerJoin(topic, eq(thread.topicId, topic.id))
    .orderBy(topic.title, thread.title, post.title);

  function SideNav() {
    return (
      <div className=" hidden border-r bg-muted/40 md:block animate-slide-in-left">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex flex-shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Home className="h-6 w-6" />
              <span className="">pd&apos;s blog</span>
            </Link>
          </div>
          <nav className=" px-2 gap-3 text-sm font-medium lg:px-4">
            <ScrollArea className="flex flex-col flex-grow h-[calc(100vh-40px)] w-full">
              {topics.map((topic) => {
                const IconComponent = iconMap[topic.icon];
                const topicThreads = threads.filter(
                  (thread) => thread.topicId === topic.id
                );
                return (
                  <>
                    <div>
                      <Link
                        key={topic.id}
                        href={`/topics#${topic.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {topic.title}
                      </Link>
                      <Separator />

                      <ScrollArea className="ml-2 py-1 h-64 w-full">
                        {topicThreads.map((thread) => (
                          <div key={thread.id} className="w-full">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Link
                                    href={`/topics/${thread.slug}`}
                                    className="flex ml-4 py-2 text-muted-foreground transition-all hover:text-primary">
                                    {trimString(thread.title, 30)}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{thread.title}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </>
                );
              })}
            </ScrollArea>
          </nav>
          {/* <div className="mt-auto p-4">
              <Link
                href="#"
                className="flex items-center gap-2 px-2 w-full text-lg font-semibold text-muted-foreground md:text-base">
                <Settings className="h-5 w-5 transition-all " />
                <span className="">Settings</span>
              </Link>
            </div> */}
        </div>
      </div>
    );
  }

  function TopNav() {
    return (
      <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 animate-slide-in-top ">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex flex-col gap-4 border-b p-4 pt-0 lg:h-[60px] lg:px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Home className="h-6 w-6" />
                <span className="">Da blog</span>
              </Link>
              <Link className="font-semibold" href="/topics">
                Topics
              </Link>
              <Link className="font-semibold" href="/about">
                About
              </Link>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              {topics.map((topic) => {
                const IconComponent = iconMap[topic.icon];
                const topicThreads = threads.filter(
                  (thread) => thread.topicId === topic.id
                );
                return (
                  <>
                    <div>
                      <Link
                        key={topic.id}
                        href={`/topics#${topic.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {topic.title}
                      </Link>
                      <Separator />

                      <ScrollArea className="ml-2 py-1 h-64 w-full rounded-lg ">
                        {topicThreads.map((thread) => (
                          <>
                            <Link
                              key={thread.id}
                              href={`/topics/${thread.slug}`}
                              className="flex ml-4 py-2 text-muted-foreground transition-all hover:text-primary">
                              <span className="">
                                {trimString(thread.title, 30)}
                              </span>
                            </Link>
                          </>
                        ))}
                      </ScrollArea>
                    </div>
                  </>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        {/* Search */}

        <SearchDialog posts={posts} />

        <div className="flex-1 flex items-center justify-end gap-4">
          <Link className="hidden md:block" href="/">
            Home
          </Link>
          <Link className="hidden md:block" href="/latest">
            Latest
          </Link>
          <Link className="hidden md:block" href="/topics">
            Topics
          </Link>
          <Link className="hidden md:block" href="/about">
            About
          </Link>
        </div>

        {/* Add user commenting in the future and thus add users*/}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>

            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <ThemeSwitcher />
      </header>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="fixed inset-0 grid min-h-screen w-full md:grid-cols-[280px_1fr]">
            <SideNav />
            <div className="flex flex-col overflow-y-auto">
              <TopNav />
              {/* Push content to center of the screen */}
              {/* <div className="md:pr-[280px]">{children}</div> */}
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
