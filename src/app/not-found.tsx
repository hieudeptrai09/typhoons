import Menu from "@/app/(home)/_components/Menu";
import TyphoonSymbol from "@/lib/components/TyphoonSpinner/TyphoonSymbol";
import Footer from "@/lib/layout/Footer";
import "./not-found.css";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-100 to-sky-200">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* 404 — the typhoon swirl stands in for the middle "0" */}
        <h1
          aria-label="404 — Page not found"
          className="mb-6 flex items-center justify-center gap-3 select-none sm:gap-4"
        >
          <span aria-hidden className="text-8xl font-black text-sky-800 tabular-nums sm:text-9xl">
            4
          </span>
          <TyphoonSymbol className="nf-swirl h-20 w-20 text-sky-700 sm:h-28 sm:w-28" />
          <span aria-hidden className="text-8xl font-black text-sky-800 tabular-nums sm:text-9xl">
            4
          </span>
        </h1>

        <p className="mb-2 text-2xl font-bold text-foreground">This page drifted off the map</p>
        <p className="mb-10 max-w-md text-base text-slate-600">
          The page you&rsquo;re looking for may have been moved, renamed, or swept away by a storm.
          Let&rsquo;s get you back on course.
        </p>

        {/* Same rounded action buttons as the home page, so every dead end has a clear way out */}
        <nav aria-label="Suggested pages" className="flex w-full max-w-sm flex-col gap-4">
          <Menu href="/" label="Back to Home" bgColor="#0369a1" hoverBgColor="#075985" />
          <Menu
            href="/storms/all/name/"
            label="Browse Storms"
            bgColor="#2563eb"
            hoverBgColor="#1d4ed8"
          />
          <Menu
            href="/names/current/"
            label="Explore Names"
            bgColor="#0d9488"
            hoverBgColor="#0f766e"
          />
        </nav>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
