export default function SSGPage() {
  const buildTime = new Date().toISOString();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SSG</h1>
      <p className="mb-4">Generated at build time: <code>{buildTime}</code></p>
      <p className="text-gray-600">after rebulding</p>
    </div>
  );
}