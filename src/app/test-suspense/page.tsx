"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TestContent() {
  const searchParams = useSearchParams();
  const testParam = searchParams.get('test') || 'default';
  
  return (
    <div className="p-4">
      <h1>Test Suspense Page</h1>
      <p>Test parameter: {testParam}</p>
    </div>
  );
}

export default function TestSuspensePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestContent />
    </Suspense>
  );
}