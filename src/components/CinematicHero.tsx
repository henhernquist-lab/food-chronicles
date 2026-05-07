import { useEffect, useRef, useState } from "react";
import { Article } from "@/data/articles";

interface CinematicHeroProps {
  article: Article;
  staticImage: string;
}

/**
 * 🎬 Cinematic Article Hero — Feature 10
 *
 * Fetches a looping video from the Pexels API matching the article's food name.
 * Falls back to the static hero image if:
 *  - No PEXELS_API_KEY is configured
 *  - No video is found
 *  - The video fails to load within 3 seconds
 *
 * The video is always muted and autoplays on loop.
 * The Pexels API key is read from import.meta.env.VITE_PEXELS_API_KEY.
 * (For production, proxy through a server-side function to keep the key secret.)
 */
export function CinematicHero({ article, staticImage }: CinematicHeroProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY as string | undefined;
    if (!apiKey) {
      setUseFallback(true);
      return;
    }

    let cancelled = false;

    const fetchVideo = async () => {
      try {
        const query = encodeURIComponent(article.food);
        const res = await fetch(
          `https://api.pexels.com/videos/search?query=${query}&per_page=1&orientation=landscape`,
          { headers: { Authorization: apiKey } }
        );
        if (!res.ok) throw new Error("Pexels fetch failed");
        const data = await res.json();
        const firstVideo = data.videos?.[0];
        if (!firstVideo) throw new Error("No video found");

        // Prefer HD (1280) or the highest-quality file available
        const files: Array<{ quality: string; width: number; link: string }> =
          firstVideo.video_files ?? [];
        const sorted = [...files].sort((a, b) => b.width - a.width);
        const best = sorted.find(f => f.quality === "hd") ?? sorted[0];

        if (!cancelled && best?.link) {
          setVideoUrl(best.link);
          // 3-second timeout — if video hasn't loaded by then, fall back
          timeoutRef.current = setTimeout(() => {
            if (!videoLoaded) setUseFallback(true);
          }, 3000);
        } else {
          if (!cancelled) setUseFallback(true);
        }
      } catch {
        if (!cancelled) setUseFallback(true);
      }
    };

    fetchVideo();
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.food]);

  const handleVideoLoaded = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setUseFallback(true);
  };

  const showVideo = videoUrl && !useFallback;

  return (
    <div
      className="hero-container relative overflow-hidden"
      style={{ height: "85vh" }}
    >
      {/* ── Static image (always rendered as placeholder / fallback) ── */}
      <img
        src={staticImage}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "saturate(0.7) brightness(0.6)",
          transition: "opacity 0.8s ease",
          opacity: showVideo && videoLoaded ? 0 : 1,
        }}
      />

      {/* ── Pexels video ── */}
      {showVideo && (
        <video
          ref={videoRef}
          className="hero-video parallax-gpu absolute inset-0 w-full h-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={{
            filter: "saturate(0.7) brightness(0.6)",
            opacity: videoLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      )}

      {/* ── Gradient overlay ── */}
      <div
        className="hero-overlay absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(12,10,8,0.4) 50%, rgba(12,10,8,0.95) 100%)",
        }}
      />

      {/* ── Article title & meta ── */}
      <div
        className="hero-content absolute z-10"
        style={{ bottom: 60, left: 60, right: 60 }}
      >
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/30 text-primary rounded-sm mb-3">
          {article.category}
        </span>
        <h1
          className="font-serif font-bold leading-tight mb-4 text-white"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            fontFamily: "'Playfair Display', serif",
            textShadow: "0 2px 40px rgba(0,0,0,0.5)",
          }}
        >
          {article.emoji} {article.title}
        </h1>
        <p
          className="text-white/80 max-w-2xl"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}
        >
          {article.teaser}
        </p>
        <div className="flex items-center gap-4 text-sm text-white/60 mt-4">
          <span>{article.category}</span>
          <span>·</span>
          <span>8 min read</span>
          <span>·</span>
          <span>
            {new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
