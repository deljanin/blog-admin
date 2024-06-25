'use client';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DynamicBreadcrumb from './dynamic-breadcrumb';

type PostWithThreadAndTopic = {
  id: number;
  title: string;
  slug: string;
  threadTitle: string;
  topicTitle: string;
};
export default function SearchDialog({
  posts,
}: {
  posts: PostWithThreadAndTopic[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const postsByThread = posts.reduce((acc, post) => {
    if (!acc[post.threadTitle]) {
      acc[post.threadTitle] = [];
    }
    acc[post.threadTitle].push(post);
    return acc;
  }, {} as Record<string, PostWithThreadAndTopic[]>);

  const handleKeyDown = (event: any, url: string) => {
    if (event.key === 'Enter') {
      setOpen(false);
      router.push(url);
    }
  };

  return (
    <div className="w-full flex flex-auto relative">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full outline-none">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="cursor-pointer w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Search</DialogTitle>
          <Command>
            <CommandInput placeholder="Search for posts" />
            <CommandList>
              <CommandEmpty>No posts found.</CommandEmpty>
              {Object.entries(postsByThread).map(([threadTitle, posts]) => (
                <div key={threadTitle}>
                  <CommandGroup
                    heading={
                      <DynamicBreadcrumb
                        pathNames={[posts[0].topicTitle, threadTitle]}
                      />
                    }>
                    {posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="cursor-pointer"
                        onClick={() => setOpen(false)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, `/posts/${post.slug}`)
                        }>
                        <CommandItem>{post.title}</CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </div>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
