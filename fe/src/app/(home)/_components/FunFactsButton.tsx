"use client";

import { useState } from "react";
import { App } from "antd";
import { Sparkles } from "lucide-react";
import TyphoonSpinner from "../../../components/components/TyphoonSpinner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const CATEGORY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  longevity: { label: "Longevity", color: "#1d4ed8", bg: "#dbeafe" },
  retirement: { label: "Retirement", color: "#b91c1c", bg: "#fee2e2" },
  records: { label: "Record", color: "#7e22ce", bg: "#f3e8ff" },
  variety: { label: "Variety", color: "#0f766e", bg: "#ccfbf1" },
  naming: { label: "Naming", color: "#b45309", bg: "#fef3c7" },
  rarity: { label: "Rarity", color: "#be185d", bg: "#fce7f3" },
};

const FunFactsButton = () => {
  const { modal } = App.useApp();
  const [loading, setLoading] = useState(false);

  const showFact = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/facts?random=1`);
      const json = await res.json();
      const fact = json.data;

      if (!fact) return;

      const style = CATEGORY_STYLES[fact.category] ?? {
        label: fact.category,
        color: "#374151",
        bg: "#f3f4f6",
      };

      modal.info({
        icon: null,
        width: 480,
        centered: true,
        okText: "Got it",
        okButtonProps: {
          style: { backgroundColor: "#0284c7", borderColor: "#0284c7" },
        },
        content: (
          <div style={{ padding: "4px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                color: style.color,
                backgroundColor: style.bg,
                marginBottom: "12px",
              }}
            >
              {style.label}
            </span>
            <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#374151", margin: 0 }}>
              {fact.text}
            </p>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={showFact}
      disabled={loading}
      className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900 disabled:opacity-60"
    >
      {loading ? <TyphoonSpinner size="small" /> : <Sparkles size={16} />}
      Useless Facts
    </button>
  );
};

export default FunFactsButton;
