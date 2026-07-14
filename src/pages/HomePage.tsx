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

  const heroCat = hero ? (CAT_META[hero.category] ?? CAT_META["All"]) : CAT_META["All"];

  // Admin: trigger article generation
  const handleGenerate = async () => {
    if (!supabaseUrl || !supabaseAnon) {
      setGenResult("❌ Supabase env vars not set");
      return;
    }
    setGenerating(true);
    setGenResult(null);
    try {
      const res = await fetch(
        `${supabaseUrl}/functions/v1/generate-daily-article`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseAnon}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const data = await res.json();
      if (data.success) {
        setGenResult(`✅ Generated: ${data.article}`);
        fetchLiveData();
      } else {
        setGenResult(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setGenResult(`❌ Network error: ${String(err)}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0C0A08" }}>

      {/* ── MASTHEAD ─────────────────────────────────────────────────────── */}
      <header className="relative z-10 pt-12 pb-8 md:pt-20 md:pb-12 px-6 text-center border-b border-white/5">

        {/* Top bar */}
        <div className="flex items-center justify-between max-w-6xl mx-auto mb-8">
          <Link
            to="/suggest"
            className="text-xs font-mono uppercase tracking-[0.2em] text-gold-deep hover:text-gold-warm transition-colors"
          >
            📬 Suggest a Food
          </Link>
          <KitchenModeToggle />
        </div>

        {/* Vol / date strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs tracking-[0.25em] uppercase font-mono mb-6"
          style={{ color: "#8B6914" }}
        >
          <span>Vol. I — No. {String(liveCount).padStart(2, "0")}</span>
          <span className="w-1 h-1 rounded-full bg-gold-deep" />
          <span>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="hidden md:inline w-1 h-1 rounded-full bg-gold-deep" />
          <span className="hidden md:inline">Est. 2025</span>
        </motion.div>

        {/* Title */}
        <h1
          className="masthead-title font-serif font-black tracking-tight"
          data-text="THE FOOD CHRONICLE"
          style={{ fontSize: "clamp(2.4rem, 9vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "0.01em" }}
        >
          THE FOOD CHRONICLE
        </h1>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="mx-auto mt-4 md:mt-6 origin-left"
          style={{
            height: 1,
            width: "min(640px, 80%)",
            background: "linear-gradient(90deg, transparent, #D4A853 30%, #FFD700 50%, #D4A853 70%, transparent)",
          }}
        />

        {/* Typewriter tagline */}
        <div className="mt-5 md:mt-7 italic font-serif text-sm md:text-lg" style={{ color: "rgba(250,240,220,0.7)" }}>
          {tagline}
          <span className="animate-pulse">|</span>
        </div>

        {/* Live article counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.6 }}
          className="mt-7 md:mt-10 flex items-center justify-center gap-5 md:gap-10 text-[11px] md:text-xs font-mono uppercase tracking-[0.2em]"
          style={{ color: "rgba(250,240,220,0.5)" }}
        >
          <span>
            <motion.span
              key={liveCount}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-semibold"
              style={{ color: "#D4A853" }}
            >
              {liveCount}
            </motion.span>
            {" "}food histories and counting
          </span>
          <span className="w-1 h-1 rounded-full bg-gold-deep" />
          <span className="hidden md:inline">New story every morning</span>
        </motion.div>
      </header>

      {/* ── SEARCH & CONTROLS ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B6914" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search food histories..."
            className="search-input w-full rounded-sm pl-10 pr-4 py-2 text-sm border transition-colors"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#FAF0DC",
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono" style={{ color: "#8B6914" }}>{liveCount} food histories</span>
          <button
            onClick={randomArticle}
            className="p-2 rounded-sm transition-colors"
            style={{ background: "rgba(212,168,83,0.1)" }}
            title="Random article"
          >
            <Dice5 className="w-4 h-4" style={{ color: "#D4A853" }} />
          </button>
        </div>
      </div>

      {/* ── CATEGORY TABS ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allCats.map(cat => {
            const m      = CAT_META[cat] ?? CAT_META["All"];
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] whitespace-nowrap rounded-full transition-all duration-300 cat-tag-pulse"
                style={
                  active
                    ? {
                        color:      m.color,
                        border:     `1px solid ${m.color}80`,
                        background: "rgba(12,10,8,0.7)",
                        boxShadow:  `0 0 18px ${m.glow}`,
                      }
                    : {
                        color:      "rgba(250,240,220,0.4)",
                        border:     "1px solid rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.02)",
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── HERO ARTICLE ─────────────────────────────────────────────────── */}
      {hero && (
        <div ref={heroRef} className="relative w-full overflow-hidden mb-16" style={{ height: "78vh", minHeight: 540 }}>
          {/* Parallax image */}
          <div
            className="absolute inset-0 parallax-gpu"
            style={{ transform: `translateY(${parallax}px) scale(1.08)` }}
          >
            <img
              src={articleImages[hero.slug]}
              alt={hero.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradients */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,10,8,0.5) 0%, rgba(12,10,8,0.25) 35%, rgba(12,10,8,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(12,10,8,0.7) 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0 mix-blend-overlay"
            animate={{ opacity: [0.15, 0.32, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(212,168,83,0.4), transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-32">
            {/* Today's Story / Live pill */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute top-8 md:top-12 left-6 md:left-12 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-red-500/40 bg-black/40 backdrop-blur-md"
            >
              <span className="live-dot" />
              <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-red-400">
                {todaySlug && hero.slug === todaySlug ? "Today's Story" : "Latest Story"}
              </span>
            </motion.div>

            {/* Category badge */}
            <div
              className="inline-flex items-center self-start gap-2 mb-5 px-3 py-1 rounded-full text-[10px] md:text-xs uppercase tracking-[0.25em] font-mono backdrop-blur cat-tag-pulse"
              style={{
                color:      heroCat.color,
                border:     `1px solid ${heroCat.color}80`,
                background: "rgba(12,10,8,0.5)",
                boxShadow:  `0 0 20px ${heroCat.glow}`,
              }}
            >
              <span style={{ fontSize: "1.1em" }}>{hero.emoji}</span>
              {hero.category}
            </div>

            {/* Title — letter-by-letter animation */}
            <h2
              className="font-serif font-black leading-[0.96] mb-5"
              style={{ fontSize: "clamp(2rem, 6.5vw, 5.5rem)", color: "#FAF0DC" }}
            >
              {hero.title.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
                  {word.split("").map((char, ci) => (
                    <motion.span
                      key={ci}
                      initial={{ y: -40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.4 + wi * 0.06 + ci * 0.018,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h2>

            {/* Teaser */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="max-w-2xl text-base md:text-xl leading-relaxed font-serif italic mb-7"
              style={{ color: "rgba(250,240,220,0.75)" }}
            >
              {hero.teaser}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="flex items-center gap-5"
            >
              <Link to={`/article/${hero.slug}`} className="liquid-btn inline-flex items-center gap-2">
                <span className="flex items-center gap-2">
                  Read the full story
                  <ArrowRight size={16} />
                </span>
              </Link>
              <span className="text-[11px] md:text-xs font-mono uppercase tracking-[0.2em]" style={{ color: "rgba(250,240,220,0.5)" }}>
                8 min read
              </span>
            </motion.div>
          </div>

          {/* Torn paper bottom edge */}
          <svg
            className="absolute bottom-0 left-0 w-full pointer-events-none"
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{ height: 50, display: "block" }}
          >
            <path
              d="M0,60 L0,30 Q40,10 90,28 T180,22 T270,32 T360,18 T460,28 T560,14 T660,30 T760,20 T880,28 T990,16 T1100,30 T1220,22 T1340,30 T1440,20 L1440,60 Z"
              fill="#0C0A08"
            />
          </svg>
        </div>
      )}

      {/* ── THE ARCHIVE SECTION HEADER ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-3" style={{ color: "#8B6914" }}>
            The Archive
          </p>
          <h2 className="font-serif font-bold text-2xl md:text-3xl" style={{ color: "#FAF0DC" }}>
            More Food Histories
          </h2>
          <div className="divider-orn w-full max-w-xs mt-4">
            <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
          </div>
        </motion.div>
      </div>

      {/* ── ARTICLE GRID ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </div>

      {/* ── NEWSLETTER / FOOTER ──────────────────────────────────────────── */}
      <div className="border-t py-16" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="divider-orn mb-10">
            <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
          </div>
          <DigestSignup />
          <div className="mt-8 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-[0.15em]" style={{ color: "rgba(250,240,220,0.35)" }}>
            <Link to="/suggest" className="hover:text-gold-warm transition-colors">📬 Suggest a Food</Link>
            <span>·</span>
            <Link to="/suggest" className="hover:text-gold-warm transition-colors">📋 Coming Soon</Link>
          </div>

          {/* ── ADMIN TRIGGER — only visible at ?admin=true ─────────────── */}
          {isAdmin && (
            <div className="mt-12 p-6 rounded-xl border" style={{ borderColor: "rgba(212,168,83,0.3)", background: "rgba(28,21,16,0.8)" }}>
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4" style={{ color: "#8B6914" }}>
                🔐 Admin Panel — Article Generation
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-mono uppercase tracking-[0.15em] transition-all disabled:opacity-50"
                style={{
                  background: generating ? "rgba(212,168,83,0.2)" : "rgba(212,168,83,0.15)",
                  border: "1px solid rgba(212,168,83,0.4)",
                  color: "#D4A853",
                }}
              >
                <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
                {generating ? "Generating…" : "🔄 Generate Article Now"}
              </button>
              {genResult && (
                <p className="mt-3 text-sm font-mono" style={{ color: genResult.startsWith("✅") ? "#4ade80" : "#f87171" }}>
                  {genResult}
                </p>
              )}
              <p className="mt-3 text-[10px] font-mono" style={{ color: "rgba(250,240,220,0.3)" }}>
                Access: yourdomain.com?admin=true
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Render near the top of the JSX, before the hero section
<ThemeToggle />
