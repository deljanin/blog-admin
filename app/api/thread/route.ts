import { db } from '@/lib/drizzle/drizzleClient';
import { thread, topic } from '@/lib/drizzle/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const createThreadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  topicId: z.string(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const topicIdStr = url.searchParams.get('topicId');

  if (!topicIdStr) {
    return NextResponse.json({ error: 'topicId is required' }, { status: 400 });
  }

  const topicId = parseInt(topicIdStr, 10);

  if (isNaN(topicId)) {
    return NextResponse.json({ error: 'Invalid topicId' }, { status: 400 });
  }

  const threads = await db
    .select()
    .from(thread)
    .where(eq(thread.topicId, topicId));

  return NextResponse.json(threads);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { title, slug, description, topicId } =
      createThreadSchema.parse(body);

    const newThread = await db.insert(thread).values({
      title,
      slug,
      description,
      topicId: parseInt(topicId, 10),
    });

    return NextResponse.json(newThread, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle specific errors if needed
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      // Handle unexpected errors
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
