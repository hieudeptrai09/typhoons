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
import { App, Button, Tooltip } from "antd";
import { Bell, BellOff, BellRing } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Set when someone switches notifications off, so the next page load does not immediately
// resubscribe them. Without it, auto-subscribe and the off switch fight each other.
const OPT_OUT_KEY = "typhoons.push.optout";

const readOptOut = (): boolean => {
  try {
    return window.localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    // Private-mode Safari throws on localStorage; treating that as "not opted out" only
    // means the auto-subscribe attempt runs again, which is harmless.
    return false;
  }
};

const writeOptOut = (value: boolean): void => {
  try {
    if (value) window.localStorage.setItem(OPT_OUT_KEY, "1");
    else window.localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* nothing to do — the toggle still works for this session */
  }
};

const PushBell = () => {
  const { message } = App.useApp();

  const [support, setSupport] = useState<PushSupport | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);

  // Everyone gets every topic; there is no per-topic choice in the UI.
  const persist = useCallback(async () => {
    const subscription = await subscribeToPush();
    await savePushSubscription({
      endpoint: subscription.endpoint,
      p256dh: subscription.p256dh,
      auth: subscription.auth,
      topics: DEFAULT_TOPICS,
      userAgent: navigator.userAgent,
    });
    setPermission(Notification.permission);
    setEnabled(true);
  }, []);

  const disable = useCallback(async () => {
    const endpoint = await unsubscribeFromPush();
    if (endpoint) await removePushSubscription(endpoint);
    setEnabled(false);
  }, []);

  useEffect(() => {
    const current = getPushSupport();
    setSupport(current);
    if (!current.supported) return;

    setPermission(Notification.permission);

    void (async () => {
      const existing = await getExistingSubscription();
      if (existing) {
        const saved = await loadPushSubscription(existing.endpoint);
        if (saved) {
          setEnabled(true);
          return;
        }
      }

      if (readOptOut() || Notification.permission === "denied") return;

      // Subscribe on sight. Firefox and Safari require a user gesture for
      // requestPermission() and will reject this outright, which is exactly why the bell
      // stays clickable — the failure here is silent on purpose, since a toast about a
      // permission nobody asked for is worse than no notifications at all.
      try {
        await persist();
      } catch {
        setPermission(Notification.permission);
      }
    })();
  }, [persist]);

  const toggle = async () => {
    setBusy(true);
    try {
      if (enabled) {
        await disable();
        writeOptOut(true);
        message.success("Notifications off");
      } else {
        writeOptOut(false);
        await persist();
        message.success("Notifications on");
      }
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
  };

  const unsupported = support !== null && !support.supported;
  const blocked = permission === "denied";

  const tooltip = (() => {
    if (unsupported) {
      return support.reason === "needs-install"
        ? "Add this app to your Home Screen to get notifications"
        : "This browser doesn't support notifications";
    }
    if (blocked) return "Notifications are blocked in your browser settings";
    return enabled ? "Notifications on — tap to turn off" : "Tap to turn notifications on";
  })();

  const icon = (() => {
    if (unsupported || blocked) return <BellOff size={20} />;
    return enabled ? <BellRing size={20} /> : <Bell size={20} />;
  })();

  return (
    <Tooltip title={tooltip}>
      <Button
        type="text"
        onClick={toggle}
        disabled={unsupported || blocked || busy}
        loading={busy}
        aria-label={tooltip}
        aria-pressed={enabled}
        icon={icon}
        className="text-white! hover:bg-white/20! disabled:text-white/50!"
      />
    </Tooltip>
  );
};

export default PushBell;
