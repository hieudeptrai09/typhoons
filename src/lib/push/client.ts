import { PUSH_TOPICS, type PushTopic } from "./topics";

// Registered at /push/ so it never becomes the controlling worker for any page — see the
// comment at the top of public/push/sw.js.
const SW_PATH = "/push/sw.js";
const SW_SCOPE = "/push/";

export type PushSupport =
  | { supported: true }
  | { supported: false; reason: "unsupported" | "needs-install" };

const isIos = (): boolean =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS 13+ reports itself as a Mac; the touch points give it away.
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isStandalone = (): boolean =>
  window.matchMedia("(display-mode: standalone)").matches ||
  // Safari's own non-standard flag, which is still the only signal on iOS.
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

export function getPushSupport(): PushSupport {
  if (typeof window === "undefined") return { supported: false, reason: "unsupported" };

  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    // On iOS the APIs are simply absent until the app is on the home screen, which is a
    // fixable state rather than a dead end, so it gets its own message.
    return {
      supported: false,
      reason: isIos() && !isStandalone() ? "needs-install" : "unsupported",
    };
  }

  return { supported: true };
}

// VAPID keys travel as base64url; PushManager wants raw bytes.
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(normalized);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  if (existing) return existing;
  return navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE });
}

export interface SerializedSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

function serialize(subscription: PushSubscription): SerializedSubscription {
  const json = subscription.toJSON();
  const keys = json.keys ?? {};

  if (!keys.p256dh || !keys.auth) {
    throw new Error("The browser returned a push subscription without encryption keys.");
  }

  return { endpoint: subscription.endpoint, p256dh: keys.p256dh, auth: keys.auth };
}

export async function getExistingSubscription(): Promise<SerializedSubscription | null> {
  if (!getPushSupport().supported) return null;

  const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  if (!registration) return null;

  const subscription = await registration.pushManager.getSubscription();
  return subscription ? serialize(subscription) : null;
}

export type SubscribeFailure = "denied" | "unsupported" | "no-key";

export class PushSubscribeError extends Error {
  constructor(readonly kind: SubscribeFailure) {
    super(kind);
    this.name = "PushSubscribeError";
  }
}

export async function subscribeToPush(): Promise<SerializedSubscription> {
  if (!getPushSupport().supported) throw new PushSubscribeError("unsupported");

  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) throw new PushSubscribeError("no-key");

  // Safari only grants permission inside a user gesture, which is why this is only ever
  // reached from a click on the bell.
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new PushSubscribeError("denied");

  const registration = await getRegistration();
  await navigator.serviceWorker.ready.catch(() => undefined);

  const existing = await registration.pushManager.getSubscription();
  if (existing) return serialize(existing);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
  });

  return serialize(subscription);
}

export async function unsubscribeFromPush(): Promise<string | null> {
  const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
  if (!registration) return null;

  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return null;

  const { endpoint } = subscription;
  await subscription.unsubscribe();
  return endpoint;
}

export const DEFAULT_TOPICS: PushTopic[] = [...PUSH_TOPICS];
