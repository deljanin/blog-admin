import { db } from '@/lib/drizzle/drizzleClient';
import { topic } from '@/lib/drizzle/schema';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const topics = await db.query.topic.findMany();
  return NextResponse.json(topics);
}

export async function POST(request: Request) {
  const { title, icon, slug } = await request.json();
  const newTopic = await db
    .insert(topic)
    .values({ title, icon, slug })
    .returning();
  return NextResponse.json(newTopic);
}
