"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { SplitSummary } from "@/lib/split";

export default function SummaryPage() {
  const { id: sessionId } = useParams<{ id: string }>();
  const router = useRouter();
  const [summary, setSummary] = useState<SplitSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}/summary`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load summary");
        return res.json() as Promise<SplitSummary>;
      })
      .then(setSummary)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
  }, [sessionId]);

  if (error) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8 gap-3">
        <p className="text-lg font-semibold text-gray-700">Could not load summary</p>
        <button onClick={() => router.back()} className="text-indigo-600 text-sm font-medium">Go back</button>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8">
        <p className="text-sm text-gray-500 animate-pulse">Loading summary…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Who Owes What</h1>
        <p className="text-sm text-gray-500 mt-1">Includes each person&apos;s share of the service fee.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {summary.participants.length === 0 ? (
          <li className="text-sm text-gray-400 text-center py-6">No one has joined yet.</li>
        ) : (
          summary.participants.map((p) => (
            <li key={p.participantId} className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 text-lg">{p.name}</span>
                <span className="font-bold text-indigo-700 text-lg">${p.total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Items ({p.pickedItemIndices.length})</span>
                  <span>${p.itemsSubtotal.toFixed(2)}</span>
                </div>
                {p.feeShare > 0 && (
                  <div className="flex justify-between">
                    <span>Service fee share</span>
                    <span>${p.feeShare.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${summary.receiptSubtotal.toFixed(2)}</span>
        </div>
        {summary.receiptFeeAmount > 0 && (
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>${summary.receiptFeeAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-1 pt-1">
          <span>Receipt total</span>
          <span>${summary.receiptTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => router.push(`/s/${sessionId}`)}
        className="w-full rounded-2xl border border-gray-300 text-gray-700 py-3 text-base font-medium active:bg-gray-50 transition-colors"
      >
        Back to Items
      </button>

      <p className="text-xs text-gray-400 text-center">
        This app splits the bill only — it never handles payments.
      </p>
    </main>
  );
}
