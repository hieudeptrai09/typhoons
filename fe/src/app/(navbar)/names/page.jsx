"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NamesPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/names/current/");
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center">
      <div className="text-xl text-gray-600">Redirecting to Current Names Page...</div>
      <div className="text-xl text-gray-600">You can still go to Retired Names Page or Filter the names by clicking the navbar on the header.</div>
    </div>
  );
};

export default NamesPage;
