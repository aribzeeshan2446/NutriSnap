
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Directly navigate to the dashboard
    router.replace('/dashboard');
  }, [router]);

  // Display a loading indicator while redirecting
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Icons.Flame className="h-16 w-16 animate-spin text-primary" />
      <p className="sr-only">Loading...</p>
    </div>
  );
}
