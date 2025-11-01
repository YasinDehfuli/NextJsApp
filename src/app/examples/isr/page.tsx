export const revalidate = 10;

export default async function ISRPage() {
  const generatedAt = new Date().toISOString();
  const randomValue = Math.floor(Math.random() * 1000);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ISR</h1>
      <p className="mb-2">Generated At: <code>{generatedAt}</code></p>
      <p className="mb-4">Random Value: <code>{randomValue}</code></p>
      <p className="text-gray-600">every 10 sec update</p>
    </div>
  );
}