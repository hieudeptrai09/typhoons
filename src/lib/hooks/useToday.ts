import { todayISO } from "@/lib/utils/date";
import { useSyncExternalStore } from "react";

// Today is read as an external value rather than during render: a prerendered (ISR) page would
// otherwise bake in the render's date, change its output every day, and disagree with the browser
// on hydration. The server snapshot is null; the date never changes mid-session, so there is
// nothing to subscribe to.
const subscribeToToday = () => () => {};
const getNoServerDate = () => null;

/** Today as "YYYY-MM-DD" in the browser, null on the server and during hydration. */
export const useToday = (): string | null =>
  useSyncExternalStore(subscribeToToday, todayISO, getNoServerDate);
