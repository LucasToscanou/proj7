"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import type { Session } from "@/lib/sessions";

function getOrCreateParticipantId(): string {
  const key = "participantId";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function SessionPage() {
  const { id: sessionId } = useParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [rejectedIndex, setRejectedIndex] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const participantIdRef = useRef<string>("");

  // Fetch initial session data over HTTP (no socket yet)
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Session not found");
        return res.json() as Promise<Session>;
      })
      .then(setSession)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Error"));
  }, [sessionId]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !sessionId) return;

    participantIdRef.current = getOrCreateParticipantId();

    const socket = io({ path: "/socket.io", transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("session-state", (updatedSession: Session) => {
      setSession(updatedSession);
    });

    socket.on("pick-rejected", ({ itemIndex }: { itemIndex: number; takenBy: string }) => {
      setRejectedIndex(itemIndex);
      setTimeout(() => setRejectedIndex(null), 1500);
    });

    socket.emit("join-session", {
      sessionId,
      participantId: participantIdRef.current,
      name: trimmed,
    });

    setJoined(true);
  }

  function toggleItem(itemIndex: number) {
    if (!socketRef.current || !sessionId) return;
    const participantId = participantIdRef.current;
    const me = session?.participants.find((p) => p.id === participantId);
    const alreadyMine = me?.pickedItemIndices.includes(itemIndex);

    socketRef.current.emit(alreadyMine ? "release-item" : "pick-item", {
      sessionId,
      itemIndex,
      participantId,
    });
  }

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

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

  const participantId = participantIdRef.current;
  const me = session.participants.find((p) => p.id === participantId);

  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6 pb-32">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hi, {name}!</h1>
        <p className="text-sm text-gray-500 mt-1">Tap items you ordered. Locked items are taken.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {session.receipt.items.map((item, i) => {
          const isMine = me?.pickedItemIndices.includes(i) ?? false;
          const takenBy = session.participants.find(
            (p) => p.id !== participantId && p.pickedItemIndices.includes(i)
          );
          const isLocked = !!takenBy;
          const isRejected = rejectedIndex === i;

          return (
            <li
              key={i}
              onClick={() => !isLocked && toggleItem(i)}
              role="checkbox"
              aria-checked={isMine}
              aria-disabled={isLocked}
              className={[
                "flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm select-none transition-colors",
                isLocked
                  ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                  : isMine
                  ? "border-indigo-400 bg-indigo-50 cursor-pointer active:scale-[0.98]"
                  : isRejected
                  ? "border-red-300 bg-red-50 cursor-pointer"
                  : "border-gray-200 bg-white cursor-pointer active:scale-[0.98]",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={[
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isLocked
                      ? "border-gray-300 bg-gray-300"
                      : isMine
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {isMine && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isLocked && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <rect x="1" y="4" width="8" height="6" rx="1" fill="white" />
                      <path d="M3 4V3a2 2 0 1 1 4 0v1" stroke="white" strokeWidth="1.2" fill="none" />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <p className={["font-medium truncate", isMine ? "text-indigo-900" : isLocked ? "text-gray-400" : "text-gray-900"].join(" ")}>
                    {item.name}
                  </p>
                  {item.qty > 1 && <p className="text-xs text-gray-400">×{item.qty}</p>}
                  {isLocked && (
                    <p className="text-xs text-gray-400">{takenBy!.name}</p>
                  )}
                </div>
              </div>
              <span className={["font-semibold ml-4 flex-shrink-0", isMine ? "text-indigo-700" : isLocked ? "text-gray-400" : "text-gray-800"].join(" ")}>
                ${item.price.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${session.receipt.subtotal.toFixed(2)}</span>
        </div>
        {session.receipt.serviceFeePct > 0 && (
          <div className="flex justify-between">
            <span>Service fee ({session.receipt.serviceFeePct}%)</span>
            <span>${((session.receipt.subtotal * session.receipt.serviceFeePct) / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-1 pt-1">
          <span>Total</span>
          <span>${session.receipt.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Sticky bottom bar: my share + summary link */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 max-w-lg mx-auto flex flex-col gap-2">
        {(me?.pickedItemIndices.length ?? 0) > 0 && (() => {
          const mySubtotal = (me?.pickedItemIndices ?? []).reduce(
            (sum, idx) => sum + (session.receipt.items[idx]?.price ?? 0),
            0
          );
          const myFee =
            session.receipt.subtotal > 0
              ? (mySubtotal / session.receipt.subtotal) *
                ((session.receipt.subtotal * session.receipt.serviceFeePct) / 100)
              : 0;
          return (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Your share ({me!.pickedItemIndices.length} item{me!.pickedItemIndices.length !== 1 ? "s" : ""})
              </span>
              <span className="font-semibold text-indigo-700">${(mySubtotal + myFee).toFixed(2)}</span>
            </div>
          );
        })()}
        <Link
          href={`/s/${sessionId}/summary`}
          className="w-full rounded-2xl bg-indigo-600 text-white py-3 text-base font-semibold text-center active:bg-indigo-700 transition-colors"
        >
          View Summary
        </Link>
      </div>
    </main>
  );
}
