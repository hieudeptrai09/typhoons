"use client";

import { useState } from "react";
import { Input } from "antd";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Menu from "./_components/Menu";

const HomePage = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-sky-100">
      <div
        className="flex flex-col items-center justify-center p-8"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <a
          href="https://www.facebook.com/profile.php?id=61586585781960"
          target="_blank"
          className="mb-4"
        >
          <Image src="/logo.png" alt="web logo" loading="eager" width={400} height={134} />
        </a>

        <p className="mb-8 max-w-md text-center text-lg font-semibold text-gray-800">
          Track typhoons and explore their names
        </p>

        <div className="mb-10 w-full max-w-sm">
          <Input
            size="large"
            placeholder="Search typhoon names..."
            prefix={<Search size={18} className="text-gray-400" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            className="home-search-input"
          />
        </div>

        <div className="flex w-full max-w-sm flex-col gap-6">
          <Menu href="storms" label="Browse Storms" bgColor="#2563eb" hoverBgColor="#1d4ed8" />
          <Menu href="names" label="Explore Names" bgColor="#0d9488" hoverBgColor="#0f766e" />
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
