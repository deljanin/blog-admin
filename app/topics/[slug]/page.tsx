// app/topics/[slug]/page.tsx
import PostList from '@/components/post-list';
import { db } from '@/lib/drizzle/drizzleClient';
import { post, thread, topic } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

interface Params {
  slug: string;
}

export default async function Thread({ params }: { params: Params }) {
  let postsExist = true;
  const threadData = await db
    .select()
    .from(thread)
    .where(eq(thread.slug, params.slug));
  if (threadData.length === 0) return notFound();
  const threads = threadData[0];

  const posts = await db
    .select()
    .from(post)
    .where(eq(post.threadId, threadData[0].id));
  if (posts.length === 0) postsExist = false;

  function Posts() {
    if (postsExist === true) {
      return <PostList posts={posts} breadcrumbs={false} />;
    } else
      return (
        <h2 className="text-center mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          No posts yet. Stay tuned.
        </h2>
      );
  }
  return (
    <>
      <h1 className="pt-10 pb-5 text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1] md:block animate-fade-in">
        {threads.title}
      </h1>
      <p className="leading-7 text-center mb-5 animate-fade-in">
        {threads.description}
      </p>
      <Posts />
    </>
  );
}
