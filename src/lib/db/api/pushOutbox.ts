import sql from "@/lib/db";
import type { PushTopic } from "@/lib/push/topics";

export type PushOutboxKind =
  | "formed"
  | "intensified"
  | "strongest"
  | "seasonfirst"
  | "seasonlast"
  | "committee";

export type PushOutboxStatus = "pending" | "sent" | "cancelled";

export interface PushOutboxEntry {
  id: number;
  kind: PushOutboxKind;
  topic: PushTopic;
  dedupeKey: string;
  title: string;
  body: string;
  url: string;
  status: PushOutboxStatus;
  createdAt: string;
  sentAt: string | null;
  sentCount: number | null;
}

interface OutboxRow {
  id: number;
  kind: string;
  topic: string;
  dedupeKey: string;
  title: string;
  body: string;
  url: string;
  status: string;
  createdAt: string;
  sentAt: string | null;
  sentCount: number | null;
}

const SELECT_COLUMNS = `id, kind, topic, dedupekey AS "dedupeKey", title, body, url, status,
    createdat::text AS "createdAt", sentat::text AS "sentAt", sentcount AS "sentCount"`;

const toEntry = (row: OutboxRow): PushOutboxEntry => ({
  id: Number(row.id),
  kind: row.kind as PushOutboxKind,
  topic: row.topic as PushTopic,
  dedupeKey: row.dedupeKey,
  title: row.title,
  body: row.body,
  url: row.url,
  status: row.status as PushOutboxStatus,
  createdAt: row.createdAt,
  sentAt: row.sentAt,
  sentCount: row.sentCount === null ? null : Number(row.sentCount),
});

export async function getPendingOutbox(): Promise<PushOutboxEntry[]> {
  const rows = await sql.query<OutboxRow[]>(
    `SELECT ${SELECT_COLUMNS} FROM pushoutbox WHERE status = 'pending' ORDER BY createdat ASC`,
  );
  return rows.map(toEntry);
}

export async function getRecentOutbox(limit = 25): Promise<PushOutboxEntry[]> {
  const rows = await sql.query<OutboxRow[]>(
    `SELECT ${SELECT_COLUMNS} FROM pushoutbox ORDER BY createdat DESC LIMIT $1`,
    [limit],
  );
  return rows.map(toEntry);
}

export async function markOutboxSent(id: number, sentCount: number): Promise<void> {
  await sql.query(
    `UPDATE pushoutbox SET status = 'sent', sentat = now(), sentcount = $2
     WHERE id = $1 AND status = 'pending'`,
    [id, sentCount],
  );
}

export async function cancelOutboxEntry(id: number): Promise<void> {
  await sql.query(
    `UPDATE pushoutbox SET status = 'cancelled' WHERE id = $1 AND status = 'pending'`,
    [id],
  );
}

export interface EnqueueOutboxInput {
  kind: PushOutboxKind;
  topic: PushTopic;
  dedupeKey: string;
  title: string;
  body: string;
  url: string;
}

// Mirrors the push_enqueue() the storms triggers use, for the events the app queues itself.
// Returns null when dedupeKey already exists, which is how a double-click on announce
// resolves into a single notification.
export async function enqueueOutbox(input: EnqueueOutboxInput): Promise<PushOutboxEntry | null> {
  const rows = await sql.query<OutboxRow[]>(
    `INSERT INTO pushoutbox (kind, topic, dedupekey, title, body, url)
     VALUES ($1::pushoutbox_kind, $2::push_topic, $3, $4, $5, $6)
     ON CONFLICT (dedupekey) DO NOTHING
     RETURNING ${SELECT_COLUMNS}`,
    [input.kind, input.topic, input.dedupeKey, input.title, input.body, input.url],
  );

  return rows[0] ? toEntry(rows[0]) : null;
}
