'use client';
export const dynamic = 'force-dynamic';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Markdown from 'react-markdown';
import { useState } from 'react';
import TopicForm from '@/components/forms/topic-form';
import ThreadForm from '@/components/forms/thread-form';
import PostForm from '@/components/forms/post-form';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [postContent, setPostContent] = useState('');

  return (
    <main className="">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <PostForm postContent={postContent} setPostContent={setPostContent} />
          <div className="flex gap-5 p-5 w-full">
            <TopicForm />
            <ThreadForm />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="w-full flex align-center justify-center pt-5">
          <Markdown
            remarkPlugins={[remarkGfm]}
            className=" prose dark:prose-invert">
            {postContent}
          </Markdown>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
