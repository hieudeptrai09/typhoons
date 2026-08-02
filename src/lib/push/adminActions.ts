"use server";

import {
  defaultDigestSeason,
  getCommitteeDigest,
  type CommitteeDigest,
} from "@/lib/db/api/getCommitteeDigest";
import {
  cancelOutboxEntry,
  enqueueOutbox,
  getRecentOutbox,
  type PushOutboxEntry,
} from "@/lib/db/api/pushOutbox";
import { assertAdmin } from "./admin";
import { drainOutbox, type DrainResult } from "./deliver";

// Kept apart from ./actions because this module pulls in web-push, and ./actions is
// imported by the navbar bell — meaning it is compiled into every page. Only the admin
// page imports this file, so web-push stays out of everything else.

// Next masks thrown server-action errors in production, so these report failure in their
// return value instead — otherwise a wrong token would surface as an unhelpful generic
// error with nothing to act on.
export type AdminResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function guarded<T>(token: string, run: () => Promise<T>): Promise<AdminResult<T>> {
  try {
    assertAdmin(token);
    return { ok: true, data: await run() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Something went wrong." };
  }
}

export async function previewCommitteeDigest(
  token: string,
  season?: number,
): Promise<AdminResult<CommitteeDigest>> {
  return guarded(token, () => getCommitteeDigest(season ?? defaultDigestSeason()));
}

export interface AnnounceResult {
  queued: boolean;
  digest: CommitteeDigest;
}

// Queues the digest only. Sending stays a separate step so the queued text can be read
// once more, in the tray-sized form it will actually arrive in, before it goes out.
export async function announceCommitteeDigest(
  token: string,
  season?: number,
): Promise<AdminResult<AnnounceResult>> {
  return guarded(token, async () => {
    const digest = await getCommitteeDigest(season ?? defaultDigestSeason());

    if (digest.names.length === 0) {
      throw new Error(`No retired names found for the ${digest.season} season.`);
    }

    const entry = await enqueueOutbox({
      kind: "committee",
      topic: "names",
      dedupeKey: digest.dedupeKey,
      title: digest.title,
      body: digest.body,
      url: digest.url,
    });

    return { queued: entry !== null, digest };
  });
}

export async function listOutbox(token: string): Promise<AdminResult<PushOutboxEntry[]>> {
  return guarded(token, () => getRecentOutbox());
}

export async function cancelOutbox(token: string, id: number): Promise<AdminResult<null>> {
  return guarded(token, async () => {
    await cancelOutboxEntry(id);
    return null;
  });
}

export async function drainNow(token: string): Promise<AdminResult<DrainResult>> {
  return guarded(token, () => drainOutbox());
}
