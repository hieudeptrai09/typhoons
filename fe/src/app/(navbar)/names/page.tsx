"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import NamesPageContent from "./NamesPageContent";

const NamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <Spin size="large" />
        </div>
      }
    >
      <NamesPageContent />
    </Suspense>
  );
};

export default NamesPage;
