export const dynamic = 'force-dynamic';
import PostList from '@/components/post-list';
import { db } from '@/lib/drizzle/drizzleClient';
import { post, thread, topic } from '@/lib/drizzle/schema';
import { sql, desc } from 'drizzle-orm';

export default async function Latest() {
  const posts = await db
    .select({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      topic: topic.title,
      thread: thread.title,
    })
    .from(post)
    .innerJoin(topic, sql`${post.topicId} = ${topic.id}`)
    .innerJoin(thread, sql`${post.threadId} = ${thread.id}`)
    .orderBy(desc(post.createdAt))
    .limit(6);
  return (
    <main className="pt-10 flex flex-col items-center justify-center gap-10 w-full">
      <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]  md:block bg-gradient-to-r from-purple-500 to-primary inline-block text-transparent bg-clip-text animate-fade-in">
        Latest posts
      </h1>
      <div className="flex flex-wrap justify-center gap-4 align-center w-full">
        <PostList posts={posts} initialAnimationDelay={0.4} />
      </div>
    </main>
  );
}
