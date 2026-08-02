import sql from "@/lib/db";
import { isPushTopic, type PushTopic } from "@/lib/push/topics";

export interface PushSubscriptionRecord {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  topics: PushTopic[];
}

interface SubscriptionRow {
  id: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  topics: string[];
}

const toRecord = (row: SubscriptionRow): PushSubscriptionRecord => ({
  id: Number(row.id),
  endpoint: row.endpoint,
  p256dh: row.p256dh,
  auth: row.auth,
  topics: row.topics.filter(isPushTopic),
});

export interface UpsertPushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  topics: PushTopic[];
  userAgent?: string;
}

// Topics travel as one comma-joined string and are split server-side, so the enum array
// never has to survive array parameter binding.
const TOPICS_PARAM = "string_to_array($4, ',')::push_topic[]";

export async function upsertPushSubscription(
  input: UpsertPushSubscriptionInput,
): Promise<PushSubscriptionRecord> {
  const rows = await sql.query<SubscriptionRow[]>(
    `INSERT INTO pushsubscriptions (endpoint, p256dh, auth, topics, useragent)
     VALUES ($1, $2, $3, ${TOPICS_PARAM}, $5)
     ON CONFLICT (endpoint) DO UPDATE
       SET p256dh = EXCLUDED.p256dh,
           auth = EXCLUDED.auth,
           topics = EXCLUDED.topics,
           useragent = EXCLUDED.useragent,
           updatedat = now()
     RETURNING id, endpoint, p256dh, auth, topics::text[] AS topics`,
    [input.endpoint, input.p256dh, input.auth, input.topics.join(","), input.userAgent ?? null],
  );

  return toRecord(rows[0]);
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await sql.query(`DELETE FROM pushsubscriptions WHERE endpoint = $1`, [endpoint]);
}

// Drops every endpoint the push service reported as gone. Called after a send, since that
// is the only moment we learn a subscription died.
export async function deletePushSubscriptions(endpoints: string[]): Promise<void> {
  if (endpoints.length === 0) return;
  await sql.query(`DELETE FROM pushsubscriptions WHERE endpoint = ANY(string_to_array($1, '\n'))`, [
    endpoints.join("\n"),
  ]);
}

export async function getPushSubscription(
  endpoint: string,
): Promise<PushSubscriptionRecord | null> {
  const rows = await sql.query<SubscriptionRow[]>(
    `SELECT id, endpoint, p256dh, auth, topics::text[] AS topics
     FROM pushsubscriptions WHERE endpoint = $1`,
    [endpoint],
  );

  return rows[0] ? toRecord(rows[0]) : null;
}

export async function getSubscriptionsForTopic(
  topic: PushTopic,
): Promise<PushSubscriptionRecord[]> {
  const rows = await sql.query<SubscriptionRow[]>(
    `SELECT id, endpoint, p256dh, auth, topics::text[] AS topics
     FROM pushsubscriptions WHERE $1::push_topic = ANY(topics)`,
    [topic],
  );

  return rows.map(toRecord);
}
