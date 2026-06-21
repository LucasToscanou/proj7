"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@/lib/sessions";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/sessions/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Session not found");
        return res.json() as Promise<Session>;
      })
      .then(setSession)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
  }, [id]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) setJoined(true);
  }

  if (error) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8 gap-3">
        <p className="text-lg font-semibold text-gray-700">Session not found</p>
        <p className="text-sm text-gray-500">The link may have expired. Ask the host to share again.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8">
        <p className="text-sm text-gray-500 animate-pulse">Loading session…</p>
      </main>
    );
  }

  // Name entry screen
  if (!joined) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8 gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Join the Split</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your name so others can see what you picked.</p>
        </div>
        <form onSubmit={handleJoin} className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
            className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-2xl bg-indigo-600 text-white py-4 text-lg font-semibold disabled:opacity-40 active:bg-indigo-700 transition-colors"
          >
            Join
          </button>
        </form>
      </main>
    );
  }

  // Items screen
  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, {name}!</h1>
        <p className="text-sm text-gray-500 mt-1">Pick the items you ordered.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {session.receipt.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              {item.qty > 1 && <p className="text-xs text-gray-400">×{item.qty}</p>}
            </div>
            <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${session.receipt.subtotal.toFixed(2)}</span>
        </div>
        {session.receipt.serviceFeePct > 0 && (
          <div className="flex justify-between">
            <span>Service fee ({session.receipt.serviceFeePct}%)</span>
            <span>
              ${((session.receipt.subtotal * session.receipt.serviceFeePct) / 100).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-1 pt-1">
          <span>Total</span>
          <span>${session.receipt.total.toFixed(2)}</span>
        </div>
      </div>
    </main>
  );
}
