'use client';

import { Input } from '@/components/ui/input';
import { useState } from 'react';
export default function SlugInput() {
  const [slug, setSlug] = useState<string>('');
  const handleSlug = (value: string) => {
    let slug = value.toLocaleLowerCase().replaceAll(' ', '-');
    setSlug(slug);
  };
  return (
    <>
      <Input
        type="text"
        placeholder="Title"
        name="title"
        onChange={(e) => handleSlug(e.target.value)}
      />
      <Input type="text" placeholder="Slug" name="slug" value={slug} />
    </>
  );
}
