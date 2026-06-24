import { computeSplit } from "@/lib/split";
import type { Session } from "@/lib/sessions";

const baseSession: Session = {
  id: "test",
  createdAt: 0,
  receipt: {
    items: [
      { name: "Beer", qty: 1, price: 10 },
      { name: "Burger", qty: 1, price: 20 },
      { name: "Wine", qty: 1, price: 30 },
    ],
    subtotal: 60,
    serviceFeePct: 10,
    total: 66,
  },
  participants: [
    { id: "alice", name: "Alice", pickedItemIndices: [0] },     // $10 + $1 fee = $11
    { id: "bob", name: "Bob", pickedItemIndices: [1, 2] },       // $50 + $5 fee = $55
  ],
};

describe("computeSplit", () => {
  it("calculates correct totals per participant", () => {
    const summary = computeSplit(baseSession);
    const alice = summary.participants.find((p) => p.name === "Alice")!;
    const bob = summary.participants.find((p) => p.name === "Bob")!;

    expect(alice.itemsSubtotal).toBeCloseTo(10, 2);
    expect(alice.feeShare).toBeCloseTo(1, 2);
    expect(alice.total).toBeCloseTo(11, 2);

    expect(bob.itemsSubtotal).toBeCloseTo(50, 2);
    expect(bob.feeShare).toBeCloseTo(5, 2);
    expect(bob.total).toBeCloseTo(55, 2);
  });

  it("participant totals sum to receipt total (items + fee)", () => {
    const summary = computeSplit(baseSession);
    const grandTotal = summary.participants.reduce((sum, p) => sum + p.total, 0);
    expect(grandTotal).toBeCloseTo(summary.receiptTotal, 2);
  });

  it("handles zero service fee correctly", () => {
    const session: Session = {
      ...baseSession,
      receipt: { ...baseSession.receipt, serviceFeePct: 0, total: 60 },
    };
    const summary = computeSplit(session);
    const alice = summary.participants.find((p) => p.name === "Alice")!;
    expect(alice.feeShare).toBe(0);
    expect(alice.total).toBeCloseTo(10, 2);
  });

  it("handles participant with no items", () => {
    const session: Session = {
      ...baseSession,
      participants: [
        ...baseSession.participants,
        { id: "carol", name: "Carol", pickedItemIndices: [] },
      ],
    };
    const summary = computeSplit(session);
    const carol = summary.participants.find((p) => p.name === "Carol")!;
    expect(carol.total).toBe(0);
  });
});
