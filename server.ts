import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { getSession, addParticipant } from "./src/lib/sessions";
import type { Participant } from "./src/lib/sessions";

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();

interface JoinPayload {
  sessionId: string;
  participantId: string;
  name: string;
}

interface PickPayload {
  sessionId: string;
  itemIndex: number;
  participantId: string;
}

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join-session", ({ sessionId, participantId, name }: JoinPayload) => {
      const session = getSession(sessionId);
      if (!session) {
        socket.emit("error", "Session not found");
        return;
      }

      // Add participant if not already present
      const existing = session.participants.find((p) => p.id === participantId);
      if (!existing) {
        const participant: Participant = { id: participantId, name, pickedItemIndices: [] };
        addParticipant(sessionId, participant);
      }

      socket.join(sessionId);
      // Send current state to everyone in the room (including the newcomer)
      io.to(sessionId).emit("session-state", getSession(sessionId));
    });

    socket.on("pick-item", ({ sessionId, itemIndex, participantId }: PickPayload) => {
      const session = getSession(sessionId);
      if (!session) return;

      // Reject if another participant already holds this item
      const takenBy = session.participants.find(
        (p) => p.id !== participantId && p.pickedItemIndices.includes(itemIndex)
      );
      if (takenBy) {
        socket.emit("pick-rejected", { itemIndex, takenBy: takenBy.name });
        return;
      }

      const participant = session.participants.find((p) => p.id === participantId);
      if (participant && !participant.pickedItemIndices.includes(itemIndex)) {
        participant.pickedItemIndices.push(itemIndex);
      }

      io.to(sessionId).emit("session-state", getSession(sessionId));
    });

    socket.on("release-item", ({ sessionId, itemIndex, participantId }: PickPayload) => {
      const session = getSession(sessionId);
      if (!session) return;

      const participant = session.participants.find((p) => p.id === participantId);
      if (participant) {
        participant.pickedItemIndices = participant.pickedItemIndices.filter(
          (i) => i !== itemIndex
        );
      }

      io.to(sessionId).emit("session-state", getSession(sessionId));
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
