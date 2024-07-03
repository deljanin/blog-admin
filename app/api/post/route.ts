import { db } from '@/lib/drizzle/drizzleClient';
import { post, similarPost } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import ollama from 'ollama';

type SimilarPost = {
  postId: number;
  similarity: number;
};

async function embed(text: string) {
  const embeddings = await ollama.embeddings({
    model: 'nomic-embed-text',
    prompt: text,
  });

  return embeddings.embedding;
}

function cosineSimilarity(
  vecA: number[] | null,
  vecB: number[] | null
): number {
  if (!vecA || !vecB) return 0;

  const dotProduct = (vecA: number[], vecB: number[]) => {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
      product += vecA[i] * vecB[i];
    }
    return product;
  };

  const magnitude = (vec: number[]) => {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
  };

  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
}
/**
 * Adds new post to the database.
 * Calculates the embedding for the post.
 * Creates a list of recommended posts with cosine similarity.
 */
export async function POST(request: Request) {
  const { title, content, description, topicId, threadId, slug } =
    await request.json();

  const embedding = await embed(content);

  const newPost = await db
    .insert(post)
    .values({
      title,
      content,
      description,
      topicId,
      embedding,
      threadId,
      slug,
    })
    .returning()
    .then(([result]) => result);

  const allPosts = await db.query.post.findMany();

  const similarityMap = new Map<number, SimilarPost[]>();

  for (let i = 0; i < allPosts.length; i++) {
    const postA = allPosts[i];
    const similarPosts = [];

    for (let j = 0; j < allPosts.length; j++) {
      if (i !== j) {
        const postB = allPosts[j];
        const similarity = cosineSimilarity(postA.embedding, postB.embedding);

        similarPosts.push({ postId: postB.id, similarity });
      }
    }

    // Sort by similarity and take top N (e.g., top 5)
    similarPosts.sort((a, b) => b.similarity - a.similarity);
    similarityMap.set(postA.id, similarPosts.slice(0, 5));
  }
  console.log(similarityMap);
  // Clear all existing similar posts
  await db.delete(similarPost);

  // Insert new similar posts in a batch
  const insertData = [];
  for (const [postId, similarPosts] of similarityMap.entries()) {
    for (const { postId: similarPostId, similarity } of similarPosts) {
      insertData.push({
        postId,
        similarPostId,
        similarity,
      });
    }
  }

  if (insertData.length > 0) {
    await db.insert(similarPost).values(insertData);
  }

  return NextResponse.json(newPost);
}
