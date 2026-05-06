import { useEffect, useRef, useState } from "react";
import { Article } from "@/data/articles";

// ─────────────────────────────────────────────────────────────────────────────
// ElevenLabs config
// Voice: ErXwobaYiN019PkySvjV (Antoni — warm, authoritative, storytelling)
// Model: eleven_monolingual_v1
// ─────────────────────────────────────────────────────────────────────────────
const VOICE_ID = "ErXwobaYiN019PkySvjV";
const ELEVENLABS_MODEL = "eleven_monolingual_v1";
const FREE_LIMIT_SECONDS = 120; // 2 minutes for free users

interface AudioPlayerProps {
  article: Article;
}

type PlayerState = "idle" | "loading" | "playing" | "paused" | "error";

// ─────────────────────────────────────────────────────────────────────────────
// Animated waveform bars (CSS-only, gold accent)
// ─────────────────────────────────────────────────────────────────────────────
function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 3,
            background: "hsl(40 55% 58%)",
            height: active ? `${8 + Math.sin(i * 0.8) * 6}px` : "3px",
            animation: active
              ? `waveBar ${0.6 + i * 0.07}s ease-in-out infinite alternate`
              : "none",
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { height: 3px; }
          to   { height: 20px; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function AudioPlayer({ article }: AudioPlayerProps) {
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0); // 0–100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackSecondsRef = useRef(0);

  // Full article text for TTS
  const articleText = `${article.title}. ${article.hook.replace(/\n/g, " ")} ${article.body
    .replace(/## /g, "")
    .replace(/\n/g, " ")
    .replace(/\*(.*?)\*/g, "$1")}`;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (audioBlobRef.current) URL.revokeObjectURL(audioBlobRef.current);
      if (audioRef.current) audioRef.current.pause();
      window.speechSynthesis?.cancel();
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    };
  }, []);

  // ── ElevenLabs TTS ────────────────────────────────────────────────────────
  const loadElevenLabsAudio = async (): Promise<boolean> => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
    if (!apiKey) return false;

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text: articleText.slice(0, 5000), // ElevenLabs limit
            model_id: ELEVENLABS_MODEL,
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      );
      if (!res.ok) return false;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioBlobRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);

        // Free user 2-minute gate
        if (audio.currentTime >= FREE_LIMIT_SECONDS) {
          audio.pause();
          setState("paused");
          setShowPremiumGate(true);
        }
      });
      audio.addEventListener("ended", () => {
        setState("idle");
        setProgress(0);
        setCurrentTime(0);
      });

      return true;
    } catch {
      return false;
    }
  };

  // ── Web Speech API fallback ───────────────────────────────────────────────
  const startFallback = () => {
    if (!window.speechSynthesis) {
      setState("error");
      return;
    }
    setUsingFallback(true);
    const utterance = new SpeechSynthesisUtterance(articleText);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utteranceRef.current = utterance;

    utterance.onend = () => {
      setState("idle");
      setProgress(0);
      setCurrentTime(0);
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    };

    window.speechSynthesis.speak(utterance);
    setState("playing");

    // Approximate progress via timer (Web Speech API doesn't expose currentTime)
    const estimatedDuration = articleText.length / 14; // ~14 chars/sec at 0.9 rate
    setDuration(estimatedDuration);
    fallbackSecondsRef.current = 0;
    fallbackTimerRef.current = setInterval(() => {
      fallbackSecondsRef.current += 0.5;
      const pct = Math.min((fallbackSecondsRef.current / estimatedDuration) * 100, 100);
      setCurrentTime(fallbackSecondsRef.current);
      setProgress(pct);

      // Free user gate
      if (fallbackSecondsRef.current >= FREE_LIMIT_SECONDS) {
        window.speechSynthesis.cancel();
        setState("paused");
        setShowPremiumGate(true);
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
      }
    }, 500);
  };

  // ── Play / pause ──────────────────────────────────────────────────────────
  const handlePlayPause = async () => {
    if (state === "playing") {
      if (usingFallback) {
        window.speechSynthesis.pause();
      } else {
        audioRef.current?.pause();
      }
      setState("paused");
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
      return;
    }

    if (state === "paused") {
      if (usingFallback) {
        window.speechSynthesis.resume();
        // Restart timer
        fallbackTimerRef.current = setInterval(() => {
          fallbackSecondsRef.current += 0.5;
          const estimatedDuration = articleText.length / 14;
          const pct = Math.min((fallbackSecondsRef.current / estimatedDuration) * 100, 100);
          setCurrentTime(fallbackSecondsRef.current);
          setProgress(pct);
        }, 500);
      } else {
        audioRef.current?.play();
      }
      setState("playing");
      return;
    }

    // Fresh start
    setState("loading");

    // Try ElevenLabs first
    if (!audioRef.current) {
      const loaded = await loadElevenLabsAudio();
      if (!loaded) {
        // Fall back to Web Speech API
        startFallback();
        return;
      }
    }

    if (audioRef.current) {
      audioRef.current.play();
      setState("playing");
    }
  };

  // ── Scrub ─────────────────────────────────────────────────────────────────
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = parseFloat(e.target.value);
    setProgress(pct);
    if (audioRef.current) {
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration;
    }
  };

  // ── Download (premium) ────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!audioBlobRef.current) return;
    const a = document.createElement("a");
    a.href = audioBlobRef.current;
    a.download = `${article.slug}.mp3`;
    a.click();
  };

  if (!expanded) {
    return (
      <div className="my-8 flex justify-center">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
          style={{
            background: "hsl(24 15% 12%)",
            border: "1px solid rgba(212,168,83,0.25)",
            color: "hsl(40 55% 65%)",
          }}
        >
          🎧 Listen to this article
        </button>
      </div>
    );
  }

  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-40 px-4 py-3"
      style={{
        background: "hsl(24 15% 7%)",
        borderTop: "1px solid rgba(212,168,83,0.15)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        {/* Article info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl">{article.emoji}</span>
          <div className="min-w-0">
            <p
              className="text-xs font-medium truncate"
              style={{ color: "hsl(40 55% 65%)" }}
            >
              {article.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {usingFallback ? "Browser TTS" : "ElevenLabs Audio"} ·{" "}
              {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : "—"}
            </p>
          </div>
        </div>

        {/* Waveform */}
        <WaveformBars active={state === "playing"} />

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          disabled={state === "loading"}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
          style={{
            background: "hsl(40 55% 42%)",
            color: "hsl(24 18% 4%)",
          }}
        >
          {state === "loading" ? (
            <span className="text-xs">…</span>
          ) : state === "playing" ? (
            "⏸"
          ) : (
            "▶"
          )}
        </button>

        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleScrub}
          className="flex-1 h-1 accent-primary cursor-pointer"
          style={{ accentColor: "hsl(40 55% 58%)" }}
        />

        {/* Download (premium) */}
        {audioBlobRef.current && (
          <button
            onClick={handleDownload}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
            title="Download audio (Premium)"
          >
            ⬇
          </button>
        )}

        {/* Close */}
        <button
          onClick={() => {
            if (usingFallback) window.speechSynthesis.cancel();
            else audioRef.current?.pause();
            setState("idle");
            setExpanded(false);
          }}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg"
        >
          ×
        </button>
      </div>

      {/* Premium gate overlay */}
      {showPremiumGate && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-sm"
          style={{ background: "rgba(12,10,8,0.92)" }}
        >
          <div className="text-center px-6">
            <p
              className="font-serif text-base font-bold mb-1"
              style={{ color: "hsl(40 55% 68%)" }}
            >
              Enjoying the story?
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              Unlock full audio with Premium — $5/month
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 text-xs font-medium rounded-sm"
                style={{
                  background: "hsl(40 55% 42%)",
                  color: "hsl(24 18% 4%)",
                }}
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => setShowPremiumGate(false)}
                className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
