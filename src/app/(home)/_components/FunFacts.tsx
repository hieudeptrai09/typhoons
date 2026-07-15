"use client";

import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { Button, Modal } from "antd";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const FunFacts = () => {
  const [loading, setLoading] = useState(false);

  const showFact = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/facts");
      const json = await res.json();
      const fact: string | null = json.data ?? null;

      Modal.info({
        title: "Did you know?",
        icon: null,
        centered: true,
        okText: "Got it",
        content: <p className="leading-relaxed text-foreground">{fact ?? "No facts available."}</p>,
      });
    } catch {
      Modal.info({
        title: "Oops!",
        icon: null,
        centered: true,
        okText: "Close",
        content: <p className="text-foreground">Could not load fact.</p>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="text"
      icon={
        loading ? (
          <TyphoonSpinner size="small" colorClass="text-amber-700" />
        ) : (
          <Sparkles size={16} />
        )
      }
      onClick={showFact}
      disabled={loading}
      className="w-full! justify-start! text-sm! font-semibold! text-amber-700! hover:text-amber-800!"
    >
      Useless Facts
    </Button>
  );
};

export default FunFacts;
