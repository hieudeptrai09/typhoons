"use client";

import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="mb-12">
          <Image src="/logo.png" alt="web logo" width={500} height={250} />
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <Link
            href="storms"
            className="bg-yellow-300 rounded-2xl p-2 hover:bg-yellow-400 transform transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
              <span className="text-4xl">🌊</span> Typhoon List
            </h2>
          </Link>

          <Link
            href="stormnames"
            className="bg-yellow-300 rounded-2xl p-2 hover:bg-yellow-400 transform transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-green-600 text-center mb-2">
              <span className="text-4xl">📋</span> Current Names
            </h2>
          </Link>

          <Link
            href="retired"
            className="bg-yellow-300 rounded-2xl p-2 hover:bg-yellow-400 transform transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-red-600 text-center mb-2">
              <span className="text-4xl">🗃️</span> Retired Names
            </h2>
          </Link>
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
