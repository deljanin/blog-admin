'use client';
export const dynamic = 'force-dynamic';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Markdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
type Topic = {
  id: number;
  title: string;
  createdAt: Date;
  icon: string;
  slug: string;
};
export default function TopicForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

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
  const handleTopicSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      icon: formData.get('icon') as string,
    };

    try {
      const response = await fetch('/api/topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      // Optionally handle successful creation (e.g., reset form, show success message)
      if (event.currentTarget) {
        event.currentTarget.reset();
      }
      // You can also navigate or update your UI here
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      router.push('/');
    }
  };
  return (
    <form onSubmit={handleTopicSubmit} className="w-1/2 flex flex-col gap-3">
      <h2>Create Topic</h2>
      {error && <div className="text-red-500">{error}</div>}
      <Input type="text" placeholder="Title" name="title" required />
      <Input type="text" placeholder="Slug" name="slug" required />
      <Input type="text" placeholder="Icon" name="icon" required />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
