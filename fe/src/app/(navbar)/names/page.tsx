"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NamesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/names/current/");
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100">
      <div className="text-xl text-gray-700">Redirecting to Current Names Page...</div>
      <div className="text-xl text-gray-700">
        You can still go to Retired Names Page or Filter the names by clicking the navbar on the
        header.
      </div>
    </div>
  );
};

export default NamesPage;
