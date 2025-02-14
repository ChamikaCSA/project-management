import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LinearProgress } from '@mui/material';

// Dynamically import HomePage with no SSR to avoid hydration issues
const HomePage = dynamic(() => import('./home/page'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-48">
        <LinearProgress />
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-48">
          <LinearProgress />
        </div>
      </div>
    }>
      <HomePage />
    </Suspense>
  );
}
