'use client';
export const dynamic = 'force-dynamic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import SlugInput from './title-slug-input';

type Topic = {
  id: number;
  title: string;
  createdAt: Date;
  icon: string;
  slug: string;
};
type Thread = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  slug: string;
  topicId: number;
};
type TopicFormProps = {
  postContent: string;
  setPostContent: React.Dispatch<React.SetStateAction<string>>;
};
export default function PostForm({
  postContent,
  setPostContent,
}: TopicFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/topic');
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setTopics(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleTopicChange = async (value: string) => {
    const topicId = value;
    setSelectedTopicId(topicId);
    console.log('Topic ID:', topicId);
    setLoading(true);
    try {
      const response = await fetch(`/api/thread?topicId=${topicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      console.log(data);
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to fetch threads');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      topicId: formData.get('topicId') as string,
      threadId: formData.get('threadId') as string,
    };

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      // Optionally handle successful creation (e.g., reset form, show success message)
      event.currentTarget.reset();
      router.push('/'); // Redirect to home or wherever appropriate
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handlePostSubmit} className="flex flex-col gap-3 p-5">
      <h2>Create post</h2>
      {error && <p className="text-red-500">{error}</p>}
      <Select
        name="topicId"
        value={selectedTopicId}
        onValueChange={handleTopicChange}>
        <SelectTrigger className="w-[180px] h-12">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id.toString()}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select name="threadId">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Thread" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem key="loading" value="loading">
              Loading threads...
            </SelectItem>
          ) : (
            threads.map((thread) => (
              <SelectItem key={thread.id} value={thread.id.toString()}>
                {thread.title}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <SlugInput />
      <Textarea placeholder="Description" name="description" />
      <Textarea
        className="h-screen"
        placeholder="Post content"
        name="content"
        onChange={(e) => setPostContent(e.target.value)}
      />
      <Button type="submit">Create</Button>
    </form>
  );
}
