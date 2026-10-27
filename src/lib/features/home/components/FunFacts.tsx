"use client";

import TyphoonSpinner from "@/lib/components/ui/TyphoonSpinner";
import { fetchRandomFact } from "@/lib/features/home/actions";
import { App } from "antd";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import GameButton from "./GameButton";

const FunFacts = () => {
  const [loading, setLoading] = useState(false);
  const { modal } = App.useApp();

  const showFact = async () => {
    setLoading(true);
    try {
      const fact = await fetchRandomFact();

      modal.info({
        title: "Did you know?",
        icon: null,
        centered: true,
        okText: "Got it",
        content: <p className="leading-relaxed text-foreground">{fact ?? "No facts available."}</p>,
      });
    } catch {
      modal.info({
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
    <GameButton
      onClick={showFact}
      disabled={loading}
      aria-busy={loading}
      title="Useless facts"
      colorClass="bg-amber-400 text-amber-950 hover:bg-amber-500"
    >
      {loading ? (
        <TyphoonSpinner size="small" colorClass="text-amber-950" />
      ) : (
        <Lightbulb size={24} aria-hidden />
      )}
      Facts
    </GameButton>
  );
};

export default FunFacts;
