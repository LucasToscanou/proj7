"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedReceipt } from "@/app/api/receipts/route";

export default function ItemsPage() {
  const [receipt, setReceipt] = useState<ParsedReceipt | null>(null);
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

  if (!receipt) {
    return (
      <main className="flex flex-col flex-1 items-center justify-center px-6 py-8">
        <p className="text-sm text-gray-500 animate-pulse">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 px-6 py-8 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Items</h1>
        <p className="text-sm text-gray-500 mt-1">Tap items to select what you had.</p>
      </div>

      <ul className="flex flex-col gap-3">
        {receipt.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              {item.qty > 1 && (
                <p className="text-xs text-gray-400">×{item.qty}</p>
              )}
            </div>
            <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

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
    </main>
  );
}
