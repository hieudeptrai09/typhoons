"use client";

import Image from "next/image";
import Menu from "./_components/Menu";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <a
          href="https://www.youtube.com/watch?v=5LtFOkH9zwU"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-12"
        >
          <Image src="/logo.png" alt="web logo" width={500} height={250} />
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Menu
            href="storms"
            icon="🌊"
            label="Typhoon List"
            color="bg-red-500"
            hoverColor="hover:bg-red-600"
          />
          <Menu
            href="stats"
            icon="📊"
            label="Stats"
            color="bg-blue-500"
            hoverColor="hover:bg-blue-600"
          />
          <Menu
            href="stormnames"
            icon="📋"
            label="Current Names"
            color="bg-yellow-500"
            hoverColor="hover:bg-yellow-600"
          />

          <Menu
            href="retired"
            icon="🗃️"
            label="Retired Names"
            color="bg-green-500"
            hoverColor="hover:bg-green-600"
          />
        </div>
      </div>

      <footer className="bg-emerald-700 py-6">
        <p className="text-white text-center text-sm">
          © {new Date().getFullYear()} Typhoon Tracker | Explore the World of
          Tropical Storms
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
