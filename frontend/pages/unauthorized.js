import React from 'react';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="mb-6 text-gray-700">
          You do not have permission to access this page.
        </p>
        <Link href="/">
          <span className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Go Home
          </span>
        </Link>
      </div>
    </div>
  );
}