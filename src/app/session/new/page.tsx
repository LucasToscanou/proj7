"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedReceipt } from "@/app/api/receipts/route";

export default function NewSessionPage() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("receipt");
    if (!raw) {
      router.replace("/scan");
      return;
    }

    let receipt: ParsedReceipt;
    try {
      receipt = JSON.parse(raw) as ParsedReceipt;
    } catch {
      router.replace("/scan");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipt }),
        });
        if (!res.ok) throw new Error("Failed to create session");
        const { joinUrl: url } = (await res.json()) as { sessionId: string; joinUrl: string };
        setJoinUrl(url);

        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(url, { width: 280, margin: 2 });
        setQrDataUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    })();
  }, [router]);

  async function handleShare() {
    if (!joinUrl) return;
    if (navigator.share) {
      navigator.share({ url: joinUrl, title: "Join my receipt split" }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (error) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8 gap-4">
        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        <button onClick={() => router.push("/scan")} className="text-indigo-600 text-sm font-medium">
          Try again
        </button>
      </main>
    );
  }

  if (!qrDataUrl || !joinUrl) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8">
        <p className="text-sm text-gray-500 animate-pulse">Creating session…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 items-center px-6 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Share with Your Group</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ask everyone to scan this QR — no app to download.
        </p>
      </div>

      <div className="rounded-3xl bg-white shadow-lg p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt="QR code to join session" width={280} height={280} />
      </div>

      <div className="w-full rounded-2xl bg-gray-50 px-4 py-3 text-center">
        <p className="text-xs text-gray-400 mb-1">Or share this link</p>
        <p className="text-sm text-gray-700 font-medium break-all">{joinUrl}</p>
      </div>

      <button
        onClick={handleShare}
        className="w-full rounded-2xl bg-indigo-600 text-white py-4 text-lg font-semibold active:bg-indigo-700 transition-colors"
      >
        {copied ? "Copied!" : "Share Link"}
      </button>
    </main>
  );
}
