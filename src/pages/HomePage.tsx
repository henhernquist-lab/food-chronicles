import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, Dice5, RefreshCw } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { articles as staticArticles, categories } from "@/data/articles";
import { articleImages } from "@/data/articleImages";
import { ArticleCard } from "@/components/ArticleCard";
import { KitchenModeToggle } from "@/components/KitchenModeToggle";
import { DigestSignup } from "@/components/DigestSignup";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Article } from "@/data/articles";

// ── Supabase client (uses Vite env vars) ──────────────────────────────────────
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string | undefined;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase     = supabaseUrl && supabaseAnon
  ? createClient(supabaseUrl, supabaseAnon)
  : null;

// ── Category glow palette ──────────────────────────────────────────────────
const CAT_META: Record<string, { color: string; glow: string }> = {
  "All":          { color: "#D4A853", glow: "rgba(212,168,83,0.4)"  },
  "Common Foods": { color: "#D4A853", glow: "rgba(212,168,83,0.45)" },
  "Exotic Foods": { color: "#C24B2A", glow: "rgba(194,75,42,0.45)"  },
  "Spices":       { color: "#E6A53C", glow: "rgba(230,165,60,0.5)"  },
  "Drinks":       { color: "#4A7C82", glow: "rgba(74,124,130,0.5)"  },
  "Ancient Foods":{ color: "#9B59B6", glow: "rgba(155,89,182,0.45)" },
  "Food History": { color: "#D4A853", glow: "rgba(212,168,83,0.45)" },
};

// ── Typewriter hook ────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 45, startDelay = 1400) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);
  return displayed;
}

// ── Helper: is an article published today? ────────────────────────────────
function isToday(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  return dateStr.startsWith(today);
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch]                 = useState("");
  const [parallax, setParallax]             = useState(0);
  const heroRef                             = useRef<HTMLDivElement>(null);
  const navigate                            = useNavigate();
  const tagline                             = useTypewriter("The hidden histories of what you eat");

  // ── Real-time article count from Supabase ─────────────────────────────────
  const [liveCount, setLiveCount]     = useState<number>(staticArticles.length);
  const [todaySlug, setTodaySlug]     = useState<string | null>(null);

  // ── Admin trigger state ───────────────────────────────────────────────────
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
  const [generating, setGenerating]   = useState(false);
  const [genResult, setGenResult]     = useState<string | null>(null);

  // Fetch live count + today's article slug from Supabase
  const fetchLiveData = useCallback(async () => {
    if (!supabase) return;
    try {
      // Count
      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);
      if (count !== null) setLiveCount(count);

      // Today's article
      const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
      const { data } = await supabase
        .from("articles")
        .select("slug, local_date")
        .eq("is_published", true)
        .gte("local_date", today)
        .order("published_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) setTodaySlug(data[0].slug);
    } catch { /* non-fatal */ }
  }, []);

  useEffect(() => {
    fetchLiveData();

    // Supabase Realtime — increment counter when a new article is inserted
    if (!supabase) return;
    const channel = supabase
      .channel("articles-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "articles" },
        () => { fetchLiveData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchLiveData]);

  // Parallax on hero
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      setParallax(window.scrollY * 0.35);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const allCats = ["All", ...categories];

  const filtered = staticArticles.filter(a => {
    const matchCat    = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.food.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Pin today's article to the top if it exists in the static list
  const sortedFiltered = [...filtered].sort((a, b) => {
    const aToday = isToday((a as Article & { local_date?: string }).local_date);
    const bToday = isToday((b as Article & { local_date?: string }).local_date);
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    return 0;
  });

  const hero = sortedFiltered[0];
  const rest = sortedFiltered.slice(1);

  const randomArticle = () => {
    const rand = staticArticles[Math.floor(Math.random() * staticArticles.length)];
    navigate(`/article/${rand.slug}`);
  };

  // ── Admin article generation trigger ──────────────────────────────────────
  const triggerGenerate = async () => {
    if (!supabase || !isAdmin) return;
    setGenerating(true);
    setGenResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-daily-article");
      if (error) { setGenResult(`❌ ${error.message}`); }
      else { setGenResult("✅ Article generated!"); fetchLiveData(); }
    } catch (e: unknown) {
      setGenResult(`❌ ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setGenerating(false);
    }
  };

  // Today's article card (hero pin)
  const todayArticle = sortedFiltered.find(a =>
    isToday((a as Article & { local_date?: string }).local_date)
  );

  return (
    <div className="relative min-h-screen bg-[#F9F8F4] dark:bg-[#1A1A1A] transition-colors duration-300">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#F9F8F4]/90 dark:bg-[#1A1A1A]/90 backdrop-blur-sm border-b border-[#D4A853]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-serif tracking-wide text-[#2C2C2C] dark:text-[#F9F8F4]">
            Culinary Arcana
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <KitchenModeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[75vh] sm:h-[85vh] overflow-hidden flex items-end justify-start pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8"
      >
        {/* Parallax background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{
            backgroundImage: `url(${hero?.image ? articleImages[hero.image] : articleImages["default"]})`,
            transform: `translateY(${parallax}px)`,
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F8F4] dark:from-[#1A1A1A] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight text-white drop-shadow-lg">
            Culinary Arcana
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80 font-light min-h-[1.8rem]">
            {tagline}<span className="animate-pulse text-[#D4A853]">|</span>
          </p>
          {hero && (
            <Link
              to={`/article/${hero.slug}`}
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#D4A853] hover:bg-[#C29A3B] text-white font-medium rounded-full transition-colors shadow-lg shadow-[#D4A853]/30"
            >
              Read today's story <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      </section>

      {/* ── Controls ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {allCats.map(cat => {
            const meta = CAT_META[cat] ?? { color: "#D4A853", glow: "rgba(212,168,83,0.4)" };
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
                style={{
                  borderColor: isActive ? meta.color : "#D4A85333",
                  color: isActive ? meta.color : "#2C2C2C",
                  backgroundColor: isActive ? `${meta.color}15` : "transparent",
                  boxShadow: isActive ? `0 0 8px ${meta.glow}` : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search + actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search foods, titles..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-[#D4A853]/30 bg-white/80 dark:bg-[#2C2C2C]/80 text-[#2C2C2C] dark:text-[#F9F8F4] focus:outline-none focus:ring-2 focus:ring-[#D4A853]/50 placeholder:text-[#2C2C2C]/50 dark:placeholder:text-[#F9F8F4]/40"
            />
          </div>
          <button
            onClick={randomArticle}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#D4A853]/30 bg-white/80 dark:bg-[#2C2C2C]/80 text-[#2C2C2C] dark:text-[#F9F8F4] hover:bg-[#D4A853]/10 transition-colors"
          >
            <Dice5 className="w-4 h-4" /> Random
          </button>
        </div>

        {/* Admin panel (only visible when ?admin=true) */}
        {isAdmin && supabase && (
          <div className="mb-8 p-4 rounded-lg border border-[#C24B2A]/30 bg-[#C24B2A]/10">
            <div className="flex items-center gap-4">
              <button
                onClick={triggerGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2 bg-[#C24B2A] text-white rounded-full hover:bg-[#A13D20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {generating ? "Generating..." : "Trigger Daily Article"}
              </button>
              {genResult && (
                <span className="text-sm text-[#2C2C2C] dark:text-[#F9F8F4]">{genResult}</span>
              )}
            </div>
          </div>
        )}

        {/* Today's article (pinned hero card) */}
        {todayArticle && (
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-widest text-[#D4A853] mb-4 font-medium">
              ✦ Today's Fresh Story
            </h2>
            <ArticleCard article={todayArticle} featured />
          </div>
        )}

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {/* Digest signup */}
        <div className="mt-16 mb-8">
          <DigestSignup />
        </div>
      </div>
    </div>
  );
}