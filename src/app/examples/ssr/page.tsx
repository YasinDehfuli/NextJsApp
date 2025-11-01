export const dynamic = 'force-dynamic';

export default async function SSRPage() {
  const requestTime = new Date().toISOString();
  const randomData = Math.floor(Math.random() * 1000);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SSR</h1>
      <p className="mb-2">Request Time: <code>{requestTime}</code></p>
      <p className="mb-4">Random Data: <code>{randomData}</code></p>
      <p className="text-gray-600">each request render</p>
    </div>
  );
}