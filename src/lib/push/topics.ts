// Shared by the client bell and the server, so it must stay free of any node-only import.

export const PUSH_TOPICS = ["storms", "names"] as const;

export type PushTopic = (typeof PUSH_TOPICS)[number];

export interface PushTopicMeta {
  key: PushTopic;
  label: string;
  description: string;
}

// The volumes are wildly different — a couple a week in season versus one digest a year —
// which is the whole reason these are separate toggles.
export const PUSH_TOPIC_META: PushTopicMeta[] = [
  {
    key: "storms",
    label: "Storm events",
    description: "Formations, upgrades, new records and season bookends. A few a month in season.",
  },
  {
    key: "names",
    label: "Name changes",
    description: "The Typhoon Committee retirements and replacements. Once a year, each May.",
  },
];

export const isPushTopic = (value: string): value is PushTopic =>
  (PUSH_TOPICS as readonly string[]).includes(value);
