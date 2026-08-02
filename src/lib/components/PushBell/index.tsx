"use client";

import {
  loadPushSubscription,
  removePushSubscription,
  savePushSubscription,
} from "@/lib/push/actions";
import {
  DEFAULT_TOPICS,
  getExistingSubscription,
  getPushSupport,
  PushSubscribeError,
  subscribeToPush,
  unsubscribeFromPush,
  type PushSupport,
} from "@/lib/push/client";
import { PUSH_TOPIC_META, type PushTopic } from "@/lib/push/topics";
import { App, Button, Modal, Switch } from "antd";
import { Bell, BellRing } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const PushBell = () => {
  const { message } = App.useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [support, setSupport] = useState<PushSupport | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [topics, setTopics] = useState<PushTopic[]>([]);
  const [busy, setBusy] = useState(false);

  const enabled = topics.length > 0;

  // Read the browser's state once on mount so the bell shows what is actually subscribed
  // rather than what this tab last did.
  useEffect(() => {
    const current = getPushSupport();
    setSupport(current);
    if (!current.supported) return;

    setPermission(Notification.permission);

    void (async () => {
      const subscription = await getExistingSubscription();
      if (!subscription) return;

      const saved = await loadPushSubscription(subscription.endpoint);
      // A subscription the server has never heard of is stale — leave the bell off and let
      // the next enable re-register it.
      if (saved) setTopics(saved);
    })();
  }, []);

  const persist = useCallback(async (next: PushTopic[]) => {
    const subscription = await subscribeToPush();
    await savePushSubscription({
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      topics: next,
      userAgent: navigator.userAgent,
    });
    setTopics(next);
    setPermission(Notification.permission);
  }, []);

  const disable = useCallback(async () => {
    const endpoint = await unsubscribeFromPush();
    if (endpoint) await removePushSubscription(endpoint);
    setTopics([]);
  }, []);

  const run = useCallback(
    async (action: () => Promise<void>, success: string) => {
      setBusy(true);
      try {
        await action();
        message.success(success);
      } catch (error) {
        if (error instanceof PushSubscribeError && error.kind === "denied") {
          setPermission("denied");
          message.error("Notifications are blocked. Allow them in your browser settings first.");
        } else {
          message.error("Could not update notifications. Please try again.");
        }
      } finally {
        setBusy(false);
      }
    },
    [message],
  );

  const toggleAll = (checked: boolean) => {
    if (checked) void run(() => persist(DEFAULT_TOPICS), "Notifications on");
    else void run(disable, "Notifications off");
  };

  const toggleTopic = (topic: PushTopic, checked: boolean) => {
    const next = checked ? [...topics, topic] : topics.filter((item) => item !== topic);

    // The last topic switched off means "stop notifying me", so drop the subscription
    // rather than leaving an empty one the server would reject.
    if (next.length === 0) {
      void run(disable, "Notifications off");
      return;
    }

    void run(() => persist(next), "Preferences saved");
  };

  const renderBody = () => {
    if (support && !support.supported) {
      return (
        <p className="text-foreground">
          {support.reason === "needs-install"
            ? "Add this app to your Home Screen first — iOS only allows notifications for installed apps."
            : "This browser doesn't support notifications."}
        </p>
      );
    }

    if (permission === "denied") {
      return (
        <p className="text-foreground">
          Notifications are blocked for this site. Allow them in your browser settings, then come
          back here.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 font-semibold text-foreground">Notify me</p>
          <Switch checked={enabled} loading={busy} onChange={toggleAll} />
        </div>

        {PUSH_TOPIC_META.map((meta) => (
          <div key={meta.key} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-foreground">{meta.label}</p>
              <p className="m-0 text-xs text-foreground/70">{meta.description}</p>
            </div>
            <Switch
              size="small"
              className="mt-1"
              checked={topics.includes(meta.key)}
              disabled={busy || !enabled}
              onChange={(checked) => toggleTopic(meta.key, checked)}
            />
          </div>
        ))}

        <p className="m-0 text-xs text-foreground/60">
          These are database updates, not weather warnings. For live advisories, follow the JMA,
          JTWC or PAGASA.
        </p>
      </div>
    );
  };

  return (
    <>
      <Button
        type="text"
        onClick={() => setIsOpen(true)}
        aria-label={enabled ? "Notification settings (on)" : "Notification settings"}
        icon={enabled ? <BellRing size={20} /> : <Bell size={20} />}
        className="!text-white hover:!bg-white/20"
      />

      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        title="Notifications"
        centered
        footer={null}
        width={420}
      >
        {renderBody()}
      </Modal>
    </>
  );
};

export default PushBell;
