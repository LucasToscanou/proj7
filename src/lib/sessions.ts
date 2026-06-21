import type { ParsedReceipt } from "@/app/api/receipts/route";

export interface Participant {
  id: string;
  name: string;
  pickedItemIndices: number[];
}

export interface Session {
  id: string;
  receipt: ParsedReceipt;
  participants: Participant[];
  createdAt: number;
}

// module-level store — persists for the lifetime of the Node.js process (v1)
const store = new Map<string, Session>();

export function createSession(id: string, receipt: ParsedReceipt): Session {
  const session: Session = { id, receipt, participants: [], createdAt: Date.now() };
  store.set(id, session);
  return session;
}

export function getSession(id: string): Session | undefined {
  return store.get(id);
}

export function addParticipant(sessionId: string, participant: Participant): boolean {
  const session = store.get(sessionId);
  if (!session) return false;
  session.participants.push(participant);
  return true;
}
