import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt Split</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Scan a restaurant receipt and let everyone pick what they had — no app to download.
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <Link
          href="/scan"
          className="w-full rounded-2xl bg-indigo-600 text-white text-center py-4 text-lg font-semibold active:bg-indigo-700 transition-colors"
        >
          Scan a Receipt
        </Link>
      </div>

      <p className="text-xs text-gray-400 text-center">
        This app splits the bill only — it never handles payments.
      </p>
    </main>
  );
}
