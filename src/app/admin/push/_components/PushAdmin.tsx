"use client";

import type { CommitteeDigest } from "@/lib/db/api/getCommitteeDigest";
import type { PushOutboxEntry } from "@/lib/db/api/pushOutbox";
import {
  announceCommitteeDigest,
  cancelOutbox,
  drainNow,
  listOutbox,
  previewCommitteeDigest,
} from "@/lib/push/adminActions";
import { App, Button, Card, Empty, Input, InputNumber, Tag } from "antd";
import { useCallback, useState } from "react";

const STATUS_COLOR: Record<PushOutboxEntry["status"], string> = {
  pending: "gold",
  sent: "green",
  cancelled: "default",
};

interface PushAdminProps {
  defaultSeason: number;
}

const PushAdmin = ({ defaultSeason }: PushAdminProps) => {
  const { message } = App.useApp();

  const [token, setToken] = useState("");
  const [season, setSeason] = useState<number>(defaultSeason);
  const [digest, setDigest] = useState<CommitteeDigest | null>(null);
  const [outbox, setOutbox] = useState<PushOutboxEntry[] | null>(null);
  const [busy, setBusy] = useState(false);

  // Every admin action returns { ok } rather than throwing, so one helper unwraps them all.
  const run = useCallback(
    async <T,>(
      action: () => Promise<{ ok: true; data: T } | { ok: false; error: string }>,
      onSuccess: (data: T) => string,
    ) => {
      if (!token) {
        message.error("Enter the admin token first.");
        return;
      }

      setBusy(true);
      try {
        const result = await action();
        if (!result.ok) {
          message.error(result.error);
          return;
        }
        message.success(onSuccess(result.data));
      } catch {
        message.error("Request failed.");
      } finally {
        setBusy(false);
      }
    },
    [message, token],
  );

  const refreshOutbox = useCallback(
    () =>
      run(
        () => listOutbox(token),
        (data) => {
          setOutbox(data);
          return `${data.length} entries`;
        },
      ),
    [run, token],
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">Push admin</h1>

      <Card size="small" title="Admin token">
        <Input.Password
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="PUSH_ADMIN_TOKEN"
          autoComplete="off"
        />
      </Card>

      <Card size="small" title="Committee digest">
        <p className="mb-3 text-sm text-foreground/70">
          Run this once, after the May batch of retirements and replacements is fully entered. It
          reads whatever is in the database right now and queues a single notification.
        </p>

        <div className="mb-3 flex items-center gap-2">
          <span className="text-sm text-foreground">Season</span>
          <InputNumber
            value={season}
            onChange={(value) => setSeason(value ?? defaultSeason)}
            min={2000}
            max={defaultSeason + 1}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            loading={busy}
            onClick={() =>
              run(
                () => previewCommitteeDigest(token, season),
                (data) => {
                  setDigest(data);
                  return `${data.names.length} retired names found`;
                },
              )
            }
          >
            Preview
          </Button>
          <Button
            type="primary"
            loading={busy}
            onClick={() =>
              run(
                () => announceCommitteeDigest(token, season),
                (data) => {
                  setDigest(data.digest);
                  void refreshOutbox();
                  return data.queued ? "Queued" : "Already queued for this season";
                },
              )
            }
          >
            Queue digest
          </Button>
        </div>

        {digest ? (
          <div className="mt-4 rounded border border-gray-200 p-3">
            <p className="m-0 font-semibold text-foreground">{digest.title}</p>
            <p className="m-0 text-sm text-foreground">{digest.body}</p>
            <p className="m-0 mt-2 text-xs text-foreground/60">Opens {digest.url}</p>
          </div>
        ) : null}
      </Card>

      <Card
        size="small"
        title="Outbox"
        extra={
          <div className="flex gap-2">
            <Button size="small" loading={busy} onClick={refreshOutbox}>
              Refresh
            </Button>
            <Button
              size="small"
              type="primary"
              loading={busy}
              onClick={() =>
                run(
                  () => drainNow(token),
                  (data) => {
                    void refreshOutbox();
                    const sent = data.results.reduce((total, item) => total + item.sent, 0);
                    return `Drained ${data.drained} entries, ${sent} deliveries`;
                  },
                )
              }
            >
              Send pending
            </Button>
          </div>
        }
      >
        {outbox === null ? (
          <Empty description="Refresh to load" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : outbox.length === 0 ? (
          <Empty description="Nothing queued" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {outbox.map((entry) => (
              <li key={entry.id} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-semibold text-foreground">{entry.title}</p>
                    <p className="m-0 text-xs text-foreground/70">{entry.body}</p>
                    <p className="m-0 mt-1 text-xs text-foreground/50">
                      {entry.kind} · {entry.topic}
                      {entry.sentCount === null ? "" : ` · ${entry.sentCount} delivered`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Tag color={STATUS_COLOR[entry.status]}>{entry.status}</Tag>
                    {entry.status === "pending" ? (
                      <Button
                        size="small"
                        danger
                        loading={busy}
                        onClick={() =>
                          run(
                            () => cancelOutbox(token, entry.id),
                            () => {
                              void refreshOutbox();
                              return "Cancelled";
                            },
                          )
                        }
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default PushAdmin;
