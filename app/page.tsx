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

export default function Home() {
  const [postContent, setPostContent] = useState('');

  return (
    <main className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="flex gap-5 p-5 w-full">
            <TopicForm />
            <ThreadForm />
          </div>
          <PostForm postContent={postContent} setPostContent={setPostContent} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="flex align-center justify-center pt-5">
          <Markdown className="h-screen w-full  prose dark:prose-invert">
            {postContent}
          </Markdown>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
