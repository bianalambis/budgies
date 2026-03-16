import Link from "next/link";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-center flex flex-col items-center gap-6">
        <span className="text-5xl">💡</span>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Insights</h1>
          <p className="text-gray-500">This page is coming soon.</p>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
