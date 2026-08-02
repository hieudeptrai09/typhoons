// Shared by the client bell and the server, so it must stay free of any node-only import.

export const PUSH_TOPICS = ["storms", "names"] as const;

export type PushTopic = (typeof PUSH_TOPICS)[number];

export const isPushTopic = (value: string): value is PushTopic =>
  (PUSH_TOPICS as readonly string[]).includes(value);
