"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedReceipt } from "@/app/api/receipts/route";

export default function ItemsPage() {
  const [receipt, setReceipt] = useState<ParsedReceipt | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("receipt");
    if (!raw) {
      router.replace("/scan");
      return;
    }
    try {
      setReceipt(JSON.parse(raw) as ParsedReceipt);
    } catch {
      router.replace("/scan");
    }
  }, [router]);

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function handleCreateSession() {
    if (!receipt || selected.size === 0) return;
    const selectedItems = receipt.items.filter((_, i) => selected.has(i));
    sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    sessionStorage.setItem("receipt", JSON.stringify(receipt));
    router.push("/session/new");
  }

  if (!receipt) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8">
        <p className="text-sm text-gray-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  const selectedSubtotal = receipt.items
    .filter((_, i) => selected.has(i))
    .reduce((sum, item) => sum + item.price, 0);

  const selectedFee =
    receipt.subtotal > 0
      ? (selectedSubtotal / receipt.subtotal) * ((receipt.subtotal * receipt.serviceFeePct) / 100)
      : 0;

  const selectedTotal = selectedSubtotal + selectedFee;

  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6 pb-32">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pick Your Items</h1>
        <p className="text-sm text-gray-500 mt-1">Tap each item you ordered.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {receipt.items.map((item, i) => {
          const isSelected = selected.has(i);
          return (
            <li
              key={i}
              onClick={() => toggle(i)}
              className={[
                "flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm cursor-pointer select-none transition-colors active:scale-[0.98]",
                isSelected
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-white",
              ].join(" ")}
              role="checkbox"
              aria-checked={isSelected}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={[
                    "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div className="min-w-0">
                  <p className={["font-medium truncate", isSelected ? "text-indigo-900" : "text-gray-900"].join(" ")}>
                    {item.name}
                  </p>
                  {item.qty > 1 && (
                    <p className="text-xs text-gray-400">×{item.qty}</p>
                  )}
                </div>
              </div>
              <span className={["font-semibold ml-4 flex-shrink-0", isSelected ? "text-indigo-700" : "text-gray-800"].join(" ")}>
                ${item.price.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Receipt totals reference */}
      <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${receipt.subtotal.toFixed(2)}</span>
        </div>
        {receipt.serviceFeePct > 0 && (
          <div className="flex justify-between">
            <span>Service fee ({receipt.serviceFeePct}%)</span>
            <span>${((receipt.subtotal * receipt.serviceFeePct) / 100).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 mt-1 pt-1">
          <span>Total</span>
          <span>${receipt.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-2 max-w-lg mx-auto">
        {selected.size > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Your share ({selected.size} item{selected.size !== 1 ? "s" : ""})</span>
            <span className="font-semibold text-indigo-700">${selectedTotal.toFixed(2)}</span>
          </div>
        )}
        <button
          onClick={handleCreateSession}
          disabled={selected.size === 0}
          className="w-full rounded-2xl bg-indigo-600 text-white py-4 text-lg font-semibold disabled:opacity-40 active:bg-indigo-700 transition-colors"
        >
          Create Split Session
        </button>
      </div>
    </main>
  );
}
