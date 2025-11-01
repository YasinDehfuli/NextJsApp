import Link from 'next/link';

export default function ExamplesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Next.js Rendering Examples</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Link href="/examples/ssg" className="border p-4 rounded hover:bg-gray-50">
          <h2 className="font-bold">SSG</h2>
          <p className="text-sm text-gray-600">Static Site Generation</p>
        </Link>

        <Link href="/examples/ssr" className="border p-4 rounded hover:bg-gray-50">
          <h2 className="font-bold">SSR</h2>
          <p className="text-sm text-gray-600">Server-Side Rendering</p>
        </Link>

        <Link href="/examples/isr" className="border p-4 rounded hover:bg-gray-50">
          <h2 className="font-bold">ISR</h2>
          <p className="text-sm text-gray-600">Incremental Static Regeneration</p>
        </Link>

        <Link href="/examples/csr" className="border p-4 rounded hover:bg-gray-50">
          <h2 className="font-bold">CSR</h2>
          <p className="text-sm text-gray-600">Client-Side Rendering</p>
        </Link>
      </div>
    </div>
  );
}
