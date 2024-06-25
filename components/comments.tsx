'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { CircleUser } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  likes: number;
  postId: number;
  userId: number;
  user: {
    name: string;
    avatarUrl: string | null;
  };
};
type Props = {
  initialComments: Comment[];
};

export default function Comments({ initialComments }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const FormSchema = z.object({
    comment: z
      .string()
      .min(10, {
        message: 'Comment must be at least 10 characters.',
      })
      .max(254, {
        message: 'Comment must not be longer than 180 characters.',
      }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Replace with your API endpoint to post a new comment
  }
  return (
    <>
      <div className="flex flex-col gap-4 mt-5 w-full">
        {comments.map((comment) => (
          <div key={comment.id} className="w-full border rounded-lg p-5">
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.user.avatarUrl || ''} />
                <AvatarFallback>
                  <CircleUser />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{comment.user.name}</h4>
                <div className="flex items-center pb-3 pt-1">
                  <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt.toDateString()}
                  </span>
                </div>
                <p className="break-words text-sm text-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a comment..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                      You can <span>@mention</span> other users and
                      organizations.
                    </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Post comment</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
