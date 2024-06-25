'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import trimString from '@/lib/utils/trimString';
import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  description: string;
  slug: string;
  topic?: string;
  thread?: string;
};
type PostListProps = {
  posts: Post[];
  breadcrumbs?: boolean;
  initialAnimationDelay?: number;
};

export default function PostList({
  posts,
  breadcrumbs = true,
  initialAnimationDelay = 0,
}: PostListProps) {
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`flex flex-wrap justify-center gap-4 align-center w-full `}>
      {posts.map((post, index) => (
        <div
          key={post.id}
          className={`w-[430px] mx-3 sm:mx-0 opacity-0 transition-all ${
            isVisible ? 'opacity-100' : ''
          }`}
          style={{
            transitionDelay: initialAnimationDelay + 0.2 * index + 's',
          }}>
          <Link href={`/posts/${post.slug}`} key={post.id}>
            <Card className=" flex flex-col sm:aspect-square items-center overflow-hidden p-4 hover:scale-105 transition-all hover:border-primary">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                {breadcrumbs && (
                  <Breadcrumb className="pt-1">
                    <BreadcrumbList>
                      <BreadcrumbItem>{post.topic}</BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbPage>{post.thread}</BreadcrumbPage>
                    </BreadcrumbList>
                  </Breadcrumb>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-wrap ">
                  {trimString(post.description, 340)}
                </p>
              </CardContent>
              {/* <span className="absolute bottom-4 opacity-10">
                  {index + 1}
                </span> */}
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
