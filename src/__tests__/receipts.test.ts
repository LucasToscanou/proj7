import sampleReceipt from "../../fixtures/sample-receipt.json";
import type { ParsedReceipt } from "../app/api/receipts/route";

const receipt = sampleReceipt as ParsedReceipt;

describe("sample receipt fixture", () => {
  it("has the required shape", () => {
    expect(Array.isArray(receipt.items)).toBe(true);
    expect(typeof receipt.subtotal).toBe("number");
    expect(typeof receipt.serviceFeePct).toBe("number");
    expect(typeof receipt.total).toBe("number");
  });

  it("each item has name, qty, and price", () => {
    for (const item of receipt.items) {
      expect(typeof item.name).toBe("string");
      expect(item.name.length).toBeGreaterThan(0);
      expect(typeof item.qty).toBe("number");
      expect(item.qty).toBeGreaterThan(0);
      expect(typeof item.price).toBe("number");
      expect(item.price).toBeGreaterThan(0);
    }
  });

  it("item prices sum to subtotal", () => {
    const sum = receipt.items.reduce((acc, item) => acc + item.price, 0);
    expect(sum).toBeCloseTo(receipt.subtotal, 2);
  });

  it("total equals subtotal plus service fee", () => {
    const fee = (receipt.subtotal * receipt.serviceFeePct) / 100;
    expect(receipt.subtotal + fee).toBeCloseTo(receipt.total, 2);
  });
});
