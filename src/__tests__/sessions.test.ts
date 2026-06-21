import { createSession, getSession } from "@/lib/sessions";
import type { ParsedReceipt } from "@/app/api/receipts/route";

const sampleReceipt: ParsedReceipt = {
  items: [
    { name: "Beer", qty: 1, price: 10 },
    { name: "Burger", qty: 1, price: 20 },
  ],
  subtotal: 30,
  serviceFeePct: 10,
  total: 33,
};

describe("session store", () => {
  it("creates and retrieves a session by id", () => {
    const session = createSession("test-id-1", sampleReceipt);
    expect(session.id).toBe("test-id-1");
    expect(session.receipt).toEqual(sampleReceipt);
    expect(session.participants).toEqual([]);

    const found = getSession("test-id-1");
    expect(found).toBeDefined();
    expect(found!.id).toBe("test-id-1");
  });

  it("returns undefined for unknown session id", () => {
    expect(getSession("does-not-exist")).toBeUndefined();
  });

  it("stores receipt items correctly", () => {
    createSession("test-id-2", sampleReceipt);
    const session = getSession("test-id-2");
    expect(session!.receipt.items).toHaveLength(2);
    expect(session!.receipt.serviceFeePct).toBe(10);
  });
});
