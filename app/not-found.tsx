import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
      <h2 className="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        404 | Not Found
      </h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        <Button variant="outline">Return Home</Button>
      </Link>
    </div>
  );
}
