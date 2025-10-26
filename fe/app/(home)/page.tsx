"use client";

import Image from "next/image";
import Menu from "./_components/Menu";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="mb-12">
          <Image src="/logo.png" alt="web logo" width={500} height={250} />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <Menu href="storms" icon="🌊" label="Typhoon List" />
          <Menu href="stormnames" icon="📋" label="Current Names" />
          <Menu href="retired" icon="🗃️" label="Retired Names" />
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
