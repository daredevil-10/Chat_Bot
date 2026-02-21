export interface SessionRepository {
   create(sessionId: string): void;
   get(sessionId: string): any[];
   append(sessionId: string, message: any): void;
}

const sessions: Record<string, any[]> = {};

class inMemorySessionRepository implements SessionRepository {
   create(sessionId: string): void {
      sessions[sessionId] = [];
   }

   get(sessionId: string): any[] {
      return sessions[sessionId] ?? (sessions[sessionId] = []);
   }
   append(sessionId: string, message: any): void {
      this.get(sessionId).push(message);
   }
}

export const sessionRepository: SessionRepository =
   new inMemorySessionRepository();
