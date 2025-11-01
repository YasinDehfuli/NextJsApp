'use client';

import { useEffect, useState } from 'react';

export default function CSRPage() {
  const [counter, setCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date().toISOString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CSR</h1>
      <p className="mb-2">
        Live Time: <code>{mounted ? currentTime : 'Loading...'}</code>
      </p>
      <p className="text-gray-600 mb-4">update every sec</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCounter(c => c - 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          -
        </button>
        <span className="text-xl font-bold">Counter: {counter}</span>
        <button
          onClick={() => setCounter(c => c + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
