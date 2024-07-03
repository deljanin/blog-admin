import fs from 'fs';
import { db } from '@/lib/drizzle/drizzleClient';
import { post } from '@/lib/drizzle/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allPosts = await db.query.post.findMany();

    const csvData = allPosts.map(
      (post) =>
        `${post.id},${post.title},${post.content},${post.description},${post.createdAt},${post.topicId},${post.threadId},${post.slug}\n`
    );

    fs.writeFileSync(
      'posts.csv',
      'id,title,content,topicId,threadId,slug\n' + csvData.join('')
    );

    console.log('Posts saved to posts.csv');
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return NextResponse.json({ ok: true });
}

// let embeddings = [];
//   for (let i = 0; i < allPosts.length; i++) {
//     console.log(allPosts[i]);
//     embeddings[allPosts[i].id] = await embed(allPosts[i].content);
//   }

//   for (const [key, value] of Object.entries(embeddings)) {
//     db.update(post)
//       .set({ embedding: value })
//       .where(eq(post.id, parseInt(key)));
//   }
