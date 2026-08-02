import { defaultDigestSeason } from "@/lib/db/api/getCommitteeDigest";
import type { Metadata } from "next";
import PushAdmin from "./_components/PushAdmin";

// The page itself is public — the token on each action is what actually guards this, not
// the URL being unlisted. noindex just keeps it out of search results.
export const metadata: Metadata = {
  title: "Push admin",
  robots: { index: false, follow: false },
};

const PushAdminPage = () => <PushAdmin defaultSeason={defaultDigestSeason()} />;

export default PushAdminPage;
