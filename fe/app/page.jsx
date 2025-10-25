"use client";

import Link from "next/link";

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
          🌀 Typhoon Tracker
        </h1>
        <p className="text-2xl text-white text-center mb-12 drop-shadow">
          Explore the World of Tropical Storms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="storms"
            className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl"
          >
            <div className="text-6xl mb-4 text-center">🌊</div>
            <h2 className="text-3xl font-bold text-blue-600 text-center mb-2">
              Typhoon List
            </h2>
            <p className="text-gray-600 text-center">
              Browse historical typhoon data
            </p>
          </Link>

          <Link
            href="stormnames"
            className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl"
          >
            <div className="text-6xl mb-4 text-center">📋</div>
            <h2 className="text-3xl font-bold text-green-600 text-center mb-2">
              Current Names
            </h2>
            <p className="text-gray-600 text-center">
              View active typhoon names
            </p>
          </Link>

          <Link
            href="retired"
            className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl"
          >
            <div className="text-6xl mb-4 text-center">🗃️</div>
            <h2 className="text-3xl font-bold text-red-600 text-center mb-2">
              Retired Names
            </h2>
            <p className="text-gray-600 text-center">
              Explore retired storm names
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
