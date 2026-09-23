import SearchBar from "@/lib/components/SearchBar";
import { getNameList } from "@/lib/db/api/getNameList";
import { getStormHighlights } from "@/lib/db/api/getStormHighlights";
import Footer from "@/lib/layout/Footer";
import Image from "next/image";
import MainMenu from "./_components/MainMenu";

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
    // No navbar here: the menu below is this page's navigation, so a second copy of it would be redundant.
    <div className="flex min-h-screen flex-col bg-sky-100">
      {/* Brand beside the menu on wide screens, stacked above it on phones, where side by side would squeeze both. */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:gap-20">
        <div className="flex flex-col items-center lg:items-start">
          <a
            href="https://www.facebook.com/profile.php?id=61586585781960"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
          </a>

          <p className="mt-4 max-w-md text-center text-lg font-semibold text-foreground lg:text-left">
            Track typhoons and explore their names
          </p>
        </div>

        {/* Search rides with the menu rather than the brand: it is another way in, not a title. */}
        <div className="flex w-full max-w-sm flex-col gap-4">
          <SearchBar variant="home" allNames={allNames} />
          <MainMenu highlights={highlights} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
