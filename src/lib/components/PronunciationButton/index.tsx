"use client";

import { Loader2, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface PronunciationButtonProps {
  src: string;
  label: string;
  title: string;
}

type State = "idle" | "loading" | "playing";

const PronunciationButton = ({ src, label, title }: PronunciationButtonProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(
    () => () => {
      audioRef.current?.pause();
      audioRef.current = null;
    },
    [],
  );

  const play = () => {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(src);
    audio.onended = () => setState("idle");
    audioRef.current = audio;
    setState("loading");

    audio
      .play()
      .then(() => setState("playing"))
      .catch(() => setState("idle"));
  };

  return (
    <button
      type="button"
      onClick={play}
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${
        state === "playing"
          ? "border-teal-600 bg-teal-50 text-teal-700"
          : "border-slate-200 text-slate-600 hover:border-teal-600 hover:text-teal-700"
      }`}
    >
      {state === "loading" ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        <Volume2
          className={`h-3.5 w-3.5 shrink-0 ${state === "playing" ? "animate-pulse" : ""}`}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
};

export default PronunciationButton;
