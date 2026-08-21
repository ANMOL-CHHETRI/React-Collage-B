import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebaseAdmin.js";

export interface AuditLogEntry {
  id?: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
  createdAt?: unknown;
}

export class AuditService {
  private collection = db.collection("auditLogs");

  async createAuditLog(
    actorId: string,
    action: string,
    targetType: string,
    targetId: string,
    metadata?: Record<string, unknown>
  ): Promise<string> {
    const docRef = this.collection.doc();
    const entry: AuditLogEntry = {
      id: docRef.id,
      actorId,
      action,
      targetType,
      targetId,
      metadata: metadata || {},
      createdAt: FieldValue.serverTimestamp(),
    };
    await docRef.set(entry);
    return docRef.id;
  }

  async listAuditLogs(pageSize = 20, startAfterId?: string): Promise<{ data: AuditLogEntry[]; hasMore: boolean }> {
    let q = this.collection.orderBy("createdAt", "desc").limit(pageSize + 1);

    if (startAfterId) {
      const cursorDoc = await this.collection.doc(startAfterId).get();
      if (cursorDoc.exists) {
        q = q.startAfter(cursorDoc);
      }
    }

    const snap = await q.get();
    const hasMore = snap.docs.length > pageSize;
    const docs = hasMore ? snap.docs.slice(0, pageSize) : snap.docs;

    const data = docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<AuditLogEntry, "id">),
    }));

    return { data, hasMore };
  }
}
