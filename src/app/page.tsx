import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
      <div className="max-w-sm w-full space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧾 Receipt Splitter
          </h1>
          <p className="text-gray-500 text-lg">
            Scan a receipt, pick your items, split the bill.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <p className="text-gray-600 text-sm">
            Take a photo of your restaurant or bar receipt. We&apos;ll identify
            every item so your group can each pick what they had &mdash; no app to
            download.
          </p>
          <Link
            href="/scan"
            className="block w-full bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold text-center active:bg-indigo-700 transition-colors"
          >
            Scan a receipt
          </Link>
        </div>

        <p className="text-gray-400 text-xs">
          Works in your phone browser &middot; No app needed
        </p>
      </div>
    </main>
  );
}
