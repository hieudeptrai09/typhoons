"use client";

import Image from "next/image";
import Menu from "./_components/Menu";
import { TITLE_COMMON } from "../../constants";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <div
        className="flex flex-col items-center justify-center p-8"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <a
          href="https://www.youtube.com/watch?v=5LtFOkH9zwU"
          target="_blank"
          className="mb-4"
        >
          <Image
            src="/logo.png"
            alt="web logo"
            loading="eager"
            width={500}
            height={167}
          />
        </a>

        <p className="text-gray-700 text-center font-semibold text-lg mb-12 max-w-md">
          Track Typhoons and Discover Their Names
        </p>

        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Menu
            href="storms"
            label="Storms"
            color="bg-purple-800"
            hoverColor="hover:bg-purple-900"
          />
          <Menu
            href="names"
            label="Names"
            color="bg-purple-800"
            hoverColor="hover:bg-purple-900"
          />
        </div>
      </div>

      <footer className="bg-emerald-700 h-16 flex items-center justify-center">
        <p className="text-white text-center text-sm">
          © {new Date().getFullYear()} {TITLE_COMMON}
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
