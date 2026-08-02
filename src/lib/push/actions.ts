"use server";

import {
  deletePushSubscription,
  getPushSubscription,
  upsertPushSubscription,
} from "@/lib/db/api/pushSubscriptions";
import { isPushTopic, type PushTopic } from "./topics";

// Subscriber-facing actions only. The bell lives in the navbar, so this module ends up in
// the server bundle of every page — which is why nothing here may reach ./deliver and drag
// web-push along with it. Admin actions live in ./adminActions for exactly that reason.

export interface SaveSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  topics: string[];
  userAgent?: string;
}

// Anyone can call a server action, so nothing here trusts its argument: a bad endpoint
// would otherwise sit in the table forever, failing on every drain.
function validate(input: SaveSubscriptionInput): {
  endpoint: string;
  p256dh: string;
  auth: string;
  topics: PushTopic[];
} {
  let url: URL;
  try {
    url = new URL(input.endpoint);
  } catch {
    throw new Error("Invalid push endpoint.");
  }

  if (url.protocol !== "https:" || input.endpoint.length > 1000) {
    throw new Error("Invalid push endpoint.");
  }

  if (!input.p256dh || !input.auth || input.p256dh.length > 255 || input.auth.length > 255) {
    throw new Error("Invalid push subscription keys.");
  }

  const topics = input.topics.filter(isPushTopic);
  if (topics.length === 0) {
    throw new Error("Pick at least one topic.");
  }

  return { endpoint: input.endpoint, p256dh: input.p256dh, auth: input.auth, topics };
}

export async function savePushSubscription(input: SaveSubscriptionInput): Promise<PushTopic[]> {
  const validated = validate(input);

  const record = await upsertPushSubscription({
    ...validated,
    userAgent: input.userAgent?.slice(0, 255),
  });

  return record.topics;
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  await deletePushSubscription(endpoint);
}

// Lets the bell show the topics this browser actually has stored, rather than assuming
// the defaults — permission can survive a subscription being deleted server-side.
export async function loadPushSubscription(endpoint: string): Promise<PushTopic[] | null> {
  const record = await getPushSubscription(endpoint);
  return record ? record.topics : null;
}
