"use client";

import Image from "next/image";
import Menu from "./_components/Menu";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-sky-100">
      <div
        className="flex flex-col items-center justify-center p-8"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <a href="https://www.youtube.com/watch?v=5LtFOkH9zwU" target="_blank" className="mb-4">
          <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
        </a>

        <p className="mb-12 max-w-md text-center text-lg font-semibold text-gray-800">
          Track typhoons and explore their names
        </p>

        <div className="flex w-full max-w-sm flex-col gap-6">
          <Menu
            href="storms"
            label="Browse Storms"
            color="bg-blue-600"
            hoverColor="hover:bg-blue-700"
          />
          <Menu
            href="names"
            label="Explore Names"
            color="bg-teal-600"
            hoverColor="hover:bg-teal-700"
          />
        </div>
      </div>

      <footer className="flex h-16 items-center justify-center gap-2 bg-slate-900">
        <p className="text-center text-xs text-slate-400">
          Informational use only •{" "}
          <span className="text-slate-300">
            © {new Date().getFullYear()} JEBI.SE Malakas • Cá Tra
          </span>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
