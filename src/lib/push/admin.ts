import "server-only";
import { timingSafeEqual } from "node:crypto";

// Server actions are public endpoints — anyone can POST to one. The admin actions are the
// only thing standing between a stranger and a notification sent to every subscriber, so
// each of them checks this token itself rather than relying on the page being unlisted.
export function assertAdmin(token: string): void {
  const expected = process.env.PUSH_ADMIN_TOKEN;

  if (!expected) {
    throw new Error("PUSH_ADMIN_TOKEN is not set, so admin actions are disabled.");
  }

  const given = Buffer.from(token ?? "");
  const want = Buffer.from(expected);

  // Compare padded to a fixed width: timingSafeEqual throws on a length mismatch, which
  // would otherwise leak the token's length.
  const ok =
    given.length === want.length &&
    timingSafeEqual(
      Buffer.concat([given], Math.max(given.length, want.length)),
      Buffer.concat([want], Math.max(given.length, want.length)),
    );

  if (!ok) {
    throw new Error("Invalid admin token.");
  }
}
