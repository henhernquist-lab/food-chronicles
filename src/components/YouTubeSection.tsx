import { useEffect, useRef, useState } from "react";
import { Article } from "@/data/articles";

interface YouTubeSectionProps {
  article: Article;
}

interface VideoResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
}

/**
 * 🎬 YouTube Section
 *
 * Uses the YouTube Data API v3 to find the single most relevant video
 * for the article's food topic, then renders it as a lazy-loaded iframe.
 *
 * Falls back gracefully if:
 *  - No VITE_YOUTUBE_API_KEY is set
 *  - No results are returned
 *  - The API call fails
 *
 * The video is loaded lazily — the iframe is only injected after the user
 * clicks the thumbnail, preventing unnecessary network requests.
 */
export function YouTubeSection({ article }: YouTubeSectionProps) {
  const [video, setVideo] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
    if (!apiKey) {
      setError(true);
      setLoading(false);
      return;
    }

    const query = encodeURIComponent(article.youtube_query || `${article.food} history documentary`);

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&relevanceLanguage=en&videoDuration=medium&key=${apiKey}`
    )
      .then(r => {
        if (!r.ok) throw new Error("YouTube API error");
        return r.json();
      })
      .then(data => {
        const item = data.items?.[0];
        if (!item) throw new Error("No results");
        setVideo({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail:
            item.snippet.thumbnails?.maxres?.url ||
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [article.food, article.youtube_query]);

  // Don't render anything if no API key or no result
  if (error || (!loading && !video)) return null;

  return (
    <div ref={sectionRef} className="my-16 parallax-section">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center text-sm"
          style={{ background: "#FF0000" }}
        >
          ▶
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-foreground leading-none">
            Watch the Story
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curated documentary for this article
          </p>
        </div>
      </div>

      {/* Video container */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          aspectRatio: "16/9",
          background: "hsl(24 15% 8%)",
          border: "1px solid rgba(212,168,83,0.15)",
        }}
      >
        {loading ? (
          /* Skeleton loader */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"
              />
              <p className="text-xs text-muted-foreground">Finding the best video…</p>
            </div>
          </div>
        ) : video && !playing ? (
          /* Thumbnail with play button — click to load iframe */
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play: ${video.title}`}
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: "brightness(0.75)" }}
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(12,10,8,0.85) 0%, transparent 50%)",
              }}
            />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{
                  background: "rgba(255,0,0,0.9)",
                  boxShadow: "0 4px 24px rgba(255,0,0,0.4)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-7 h-7 ml-1"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Video title & channel */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p
                className="text-sm font-medium text-white leading-snug line-clamp-2 mb-1"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
              >
                {video.title}
              </p>
              <p className="text-xs text-white/60">{video.channelTitle}</p>
            </div>
          </button>
        ) : video && playing ? (
          /* Lazy-loaded iframe — only injected after click */
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : null}
      </div>

      {/* Attribution */}
      {video && !loading && (
        <p className="text-xs text-muted-foreground mt-2 opacity-60">
          Video sourced via YouTube Data API · Content belongs to respective creators
        </p>
      )}
    </div>
  );
}
