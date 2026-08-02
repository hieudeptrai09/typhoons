import "server-only";
import { getPendingOutbox, markOutboxSent, type PushOutboxEntry } from "@/lib/db/api/pushOutbox";
import { deletePushSubscriptions, getSubscriptionsForTopic } from "@/lib/db/api/pushSubscriptions";
import webpush, { WebPushError } from "web-push";
import type { PushTopic } from "./topics";

const SITE_URL = "https://typhoons.vercel.app";

let configured = false;

// Configured on first send rather than at module load: the keys are absent during build,
// and web-push throws on a malformed pair.
function configure(): void {
  if (configured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? SITE_URL;

  if (!publicKey || !privateKey) {
    throw new Error(
      "Web push is not configured: set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.",
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export const isPushConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

export interface DeliveryResult {
  entryId: number;
  title: string;
  sent: number;
  failed: number;
  pruned: number;
}

// A push service answering 404 or 410 means the subscription is permanently gone —
// the browser was reset, the app uninstalled. Anything else is transient and left alone.
const isGone = (error: unknown): boolean =>
  error instanceof WebPushError && (error.statusCode === 404 || error.statusCode === 410);

async function deliverEntry(entry: PushOutboxEntry): Promise<DeliveryResult> {
  const subscriptions = await getSubscriptionsForTopic(entry.topic as PushTopic);

  const payload = JSON.stringify({
    title: entry.title,
    body: entry.body,
    url: entry.url,
    tag: entry.dedupeKey,
  });

  const dead: string[] = [];
  let sent = 0;
  let failed = 0;

  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        payload,
        { TTL: 60 * 60 * 24 },
      ),
    ),
  );

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      sent += 1;
      return;
    }

    failed += 1;
    if (isGone(result.reason)) dead.push(subscriptions[index].endpoint);
  });

  await deletePushSubscriptions(dead);

  // Marked sent even when every delivery failed: the alternative is retrying the same
  // notification forever, and a storm upgrade nobody received an hour ago is stale anyway.
  await markOutboxSent(entry.id, sent);

  return { entryId: entry.id, title: entry.title, sent, failed, pruned: dead.length };
}

export interface DrainResult {
  drained: number;
  results: DeliveryResult[];
}

// Sends every pending outbox row, oldest first. Safe to call concurrently in the sense
// that markOutboxSent only matches rows still pending, so a double-drain cannot re-send
// an entry it already finished.
export async function drainOutbox(): Promise<DrainResult> {
  configure();

  const pending = await getPendingOutbox();
  const results: DeliveryResult[] = [];

  for (const entry of pending) {
    results.push(await deliverEntry(entry));
  }

  return { drained: results.length, results };
}
