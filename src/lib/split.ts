import type { Session } from "./sessions";

export interface ParticipantTotal {
  participantId: string;
  name: string;
  itemsSubtotal: number;
  feeShare: number;
  total: number;
  pickedItemIndices: number[];
}

export interface SplitSummary {
  participants: ParticipantTotal[];
  receiptSubtotal: number;
  receiptFeeAmount: number;
  receiptTotal: number;
}

export function computeSplit(session: Session): SplitSummary {
  const { receipt, participants } = session;
  const receiptFeeAmount = (receipt.subtotal * receipt.serviceFeePct) / 100;

  const participantTotals: ParticipantTotal[] = participants.map((p) => {
    const itemsSubtotal = p.pickedItemIndices.reduce(
      (sum, idx) => sum + (receipt.items[idx]?.price ?? 0),
      0
    );
    const feeShare =
      receipt.subtotal > 0 ? (itemsSubtotal / receipt.subtotal) * receiptFeeAmount : 0;
    return {
      participantId: p.id,
      name: p.name,
      itemsSubtotal,
      feeShare,
      total: itemsSubtotal + feeShare,
      pickedItemIndices: p.pickedItemIndices,
    };
  });

  return {
    participants: participantTotals,
    receiptSubtotal: receipt.subtotal,
    receiptFeeAmount,
    receiptTotal: receipt.total,
  };
}
