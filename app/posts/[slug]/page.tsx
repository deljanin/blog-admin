import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { db } from '@/lib/drizzle/drizzleClient';
import { comment, post, similarPost, user } from '@/lib/drizzle/schema';
import { desc, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Comments from '@/components/comments';

interface Params {
  slug: string;
}
export default async function Posts({ params }: { params: Params }) {
  let noSimilarPosts = false;
  const postData = await db
    .select()
    .from(post)
    .where(eq(post.slug, params.slug));
  if (postData.length === 0) return notFound();

  const similarPostsData = await db
    .select({
      postId: similarPost.postId,
      similarPostId: similarPost.similarPostId,
      similarity: similarPost.similarity,
      title: post.title,
      description: post.description,
      slug: post.slug,
    })
    .from(similarPost)
    .leftJoin(post, eq(similarPost.similarPostId, post.id))
    .where(eq(similarPost.postId, postData[0].id))
    .orderBy(desc(similarPost.similarity));
  if (postData.length === 0) noSimilarPosts = true;

  // const commentsData = await db
  //   .select({
  //     id: comment.id,
  //     content: comment.content,
  //     createdAt: comment.createdAt,
  //     likes: comment.likes,
  //     postId: comment.postId,
  //     userId: comment.userId,
  //     user: {
  //       name: user.name,
  //       avatarUrl: user.avatarUrl,
  //     },
  //   })
  //   .from(comment)
  //   .innerJoin(user, eq(comment.userId, user.id))
  //   .where(eq(comment.postId, postData[0].id));

  function SimilarPosts() {
    if (noSimilarPosts === false) {
      return (
        <div className="flex flex-col gap-4 mt-5 w-full">
          {similarPostsData.map((post) => (
            <Link
              href={`/posts/${post.slug}`}
              key={post.similarPostId}
              className="w-full p-2 flex items-center justify-between rounded-lg transition-all border border-transparent hover:border hover:border-primary">
              <div className="flex space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{post.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    } else
      return (
        <h4 className="text-sm font-semibold">
          No similar posts yet. Stay tuned.
        </h4>
      );
  }

  return (
    <>
      <article className="p-5 pt-10 lg:mx-auto max-w-2xl animate-fade-in">
        <Markdown
          className="prose dark:prose-invert "
          remarkPlugins={[remarkGfm]}>
          {postData[0].content}
        </Markdown>
        <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight  ">
          Similar posts
        </h2>
        <SimilarPosts />

        {/* TODO: Add comments */}
        {/* <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight  ">
          Comments
        </h2>
        {commentsData.length === 0 && (
          <h4 className="text-sm font-semibold mt-5">
            No comments yet. Be the first to comment.
          </h4>
        )}
        <Comments initialComments={commentsData} /> */}
      </article>
    </>
  );
}
