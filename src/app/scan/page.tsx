"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("receipt", file);

      const res = await fetch("/api/receipts", { method: "POST", body: form });
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg ?? "Failed to parse receipt");
      }

      const data = await res.json();
      // Store result in sessionStorage so the items page can read it without URL size limits
      sessionStorage.setItem("receipt", JSON.stringify(data));
      router.push("/items");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scan Receipt</h1>
        <p className="text-sm text-gray-500 mt-1">
          Take a photo or pick one from your gallery.
        </p>
      </div>

      {/* Photo picker */}
      <div
        className="relative flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden"
        style={{ minHeight: 220 }}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Receipt preview"
            className="w-full h-full object-contain max-h-72"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 p-8">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="text-sm font-medium">Tap to take or choose photo</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!preview || loading}
        className="w-full rounded-2xl bg-indigo-600 text-white py-4 text-lg font-semibold disabled:opacity-40 active:bg-indigo-700 transition-colors"
      >
        {loading ? "Parsing receipt…" : "Parse Receipt"}
      </button>

      {loading && (
        <p className="text-sm text-gray-500 text-center animate-pulse">
          Sending to AI — this takes a few seconds…
        </p>
      )}
    </main>
  );
}
