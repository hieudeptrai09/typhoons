import Footer from "@/lib/layout/Footer";
import Image from "next/image";
import Menu from "./_components/Menu";
import QuickActionsMenu from "./_components/QuickActionsMenu";
import StormHighlightBadge from "./_components/StormHighlightBadge";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-sky-100">
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <a
          href="https://www.facebook.com/profile.php?id=61586585781960"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4"
        >
          <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
        </a>

        <p className="mb-4 max-w-md text-center text-lg font-semibold text-foreground">
          Track typhoons and explore their names
        </p>

        <StormHighlightBadge />

        <QuickActionsMenu />

        <div className="flex w-full max-w-sm flex-col gap-4">
          <Menu href="storms" label="Browse Storms" bgColor="#2563eb" hoverBgColor="#1d4ed8" />
          <Menu href="names" label="Explore Names" bgColor="#0d9488" hoverBgColor="#0f766e" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
