import { getNameList } from "@/lib/db/api/getNameList";
import { getStormHighlights } from "@/lib/db/api/getStormHighlights";
import Footer from "@/lib/layout/Footer";
import Navbar from "@/lib/layout/NavBar";
import Image from "next/image";
import ActiveStormsButton from "./_components/ActiveStormsButton";
import FunFacts from "./_components/FunFacts";

const HomePage = async () => {
  // Search is a nav aid and the storms button is a glance: a database hiccup should empty them, not fail the homepage.
  const [allNames, highlights] = await Promise.all([
    getNameList()
      .then((res) => res.data)
      .catch(() => []),
    getStormHighlights()
      .then((res) => res.data)
      .catch(() => []),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-sky-100">
      {/* Rendered here rather than via the (navbar) layout, whose content wrapper would cap the sky's height. */}
      <Navbar allNames={allNames} />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8">
        <a
          href="https://www.facebook.com/profile.php?id=61586585781960"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4"
        >
          <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
        </a>

        <p className="mb-8 max-w-md text-center text-lg font-semibold text-foreground">
          Track typhoons and explore their names
        </p>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <ActiveStormsButton highlights={highlights} />
          <FunFacts />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
