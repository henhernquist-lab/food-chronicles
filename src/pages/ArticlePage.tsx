import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { articleImages } from "@/data/articleImages";
import { ArticleCard } from "@/components/ArticleCard";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// ── Feature components (unchanged) ───────────────────────────────────────────
import { CinematicHero } from "@/components/CinematicHero";
import { GoDeeper } from "@/components/GoDeeper";
import { FlavorWeb } from "@/components/FlavorWeb";
import { ShareCard } from "@/components/ShareCard";
import { AffiliateProducts } from "@/components/AffiliateProducts";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DigestSignup } from "@/components/DigestSignup";
import { useParallaxEffects } from "@/hooks/useParallaxEffects";
import { YouTubeSection } from "@/components/YouTubeSection";

// ── Category glow palette ─────────────────────────────────────────────────────
const CAT_META: Record<string, { color: string; glow: string }> = {
  "Common Foods": { color: "#D4A853", glow: "rgba(212,168,83,0.45)" },
  "Exotic Foods": { color: "#C24B2A", glow: "rgba(194,75,42,0.45)"  },
  "Spices":       { color: "#E6A53C", glow: "rgba(230,165,60,0.5)"  },
  "Drinks":       { color: "#4A7C82", glow: "rgba(74,124,130,0.5)"  },
  "Ancient Foods":{ color: "#9B59B6", glow: "rgba(155,89,182,0.45)" },
  "Food History": { color: "#D4A853", glow: "rgba(212,168,83,0.45)" },
};
const defaultMeta = { color: "#D4A853", glow: "rgba(212,168,83,0.4)" };

// ── Reading spotlight hook ────────────────────────────────────────────────────
function useReadingSpotlight() {
  useEffect(() => {
    const paras = document.querySelectorAll<HTMLElement>(".article-paragraph");
    if (!paras.length) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          e.target.classList.toggle("in-view", e.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    paras.forEach(p => observer.observe(p));
    return () => observer.disconnect();
  }, []);
}

export default function ArticlePage() {
  const { slug }   = useParams<{ slug: string }>();
  const article    = getArticleBySlug(slug || "");
  const [progress, setProgress] = useState(0);
  const bodyRef    = useRef<HTMLDivElement>(null);

  useParallaxEffects();
  useReadingSpotlight();

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!article)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C0A08", color: "#FAF0DC" }}>
        Article not found.{" "}
        <Link to="/" className="ml-2" style={{ color: "#D4A853" }}>
          Go home
        </Link>
      </div>
    );

  const related = getRelatedArticles(article.slug);
  const img     = articleImages[article.slug];
  const meta    = CAT_META[article.category] ?? defaultMeta;

  // Split body into paragraphs and headings for styled rendering
  const renderBody = (body: string) => {
    const lines   = body.split("\n");
    let isFirst   = true;
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
      if (line.startsWith("## ")) {
        // Ornamental divider before each section heading
        elements.push(
          <div key={`div-${i}`} className="divider-orn my-10">
            <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
          </div>
        );
        elements.push(
          <motion.h2
            key={`h-${i}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-2xl md:text-3xl font-bold mt-2 mb-6 parallax-section"
            style={{ color: "#FAF0DC" }}
          >
            {line.replace("## ", "")}
          </motion.h2>
        );
        return;
      }
      if (line.trim() === "") return;

      // First paragraph gets drop-cap treatment
      const isDropCap = isFirst;
      if (isFirst) isFirst = false;

      elements.push(
        <p
          key={`p-${i}`}
          className={`article-paragraph leading-relaxed mb-5 ${isDropCap ? "drop-cap" : ""}`}
          style={{ color: "rgba(250,240,220,0.8)", fontSize: "1.05rem", lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/"(.*?)"/g, "\u201c$1\u201d"),
          }}
        />
      );
    });

    return elements;
  };

  // Inject a pull quote at the midpoint of the body
  const bodyLines    = article.body.split("\n").filter(Boolean);
  const midIndex     = Math.floor(bodyLines.length / 2);
  const beforeMid    = bodyLines.slice(0, midIndex).join("\n");
  const afterMid     = bodyLines.slice(midIndex).join("\n");
  const pullQuoteText = article.teaser;

  return (
    <div className="min-h-screen" style={{ background: "#0C0A08" }}>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div
          className="h-full reading-progress transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back button */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-40 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] transition-colors"
        style={{ color: "#8B6914" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#D4A853")}
        onMouseLeave={e => (e.currentTarget.style.color = "#8B6914")}
      >
        <ArrowLeft size={13} />
        Back
      </Link>

      {/* ── Feature 10: Cinematic Hero ─────────────────────────────────────── */}
      <CinematicHero article={article} staticImage={img} />

      {/* ── Feature 7: Audio Player ────────────────────────────────────────── */}
      <AudioPlayer article={article} />

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <article ref={bodyRef} className="max-w-3xl mx-auto px-6 md:px-8 py-12">

        {/* Category + meta row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-10 text-[11px] font-mono uppercase tracking-[0.2em]"
          style={{ color: "rgba(250,240,220,0.45)" }}
        >
          <span
            className="px-3 py-1 rounded-full cat-tag-pulse"
            style={{
              color:      meta.color,
              border:     `1px solid ${meta.color}60`,
              background: "rgba(12,10,8,0.6)",
              boxShadow:  `0 0 14px ${meta.glow}`,
            }}
          >
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={11} /> 8 min read
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={11} />
            {new Date(article.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
        </motion.div>

        {/* Hook — styled as a lead-in blockquote */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg leading-relaxed space-y-4 mb-12 pl-6"
          style={{
            borderLeft: `2px solid ${meta.color}`,
            color: "rgba(250,240,220,0.9)",
          }}
        >
          {article.hook
            .split("\n")
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-16 parallax-section"
        >
          <h2 className="font-serif text-2xl font-bold mb-8" style={{ color: "#FAF0DC" }}>
            Timeline
          </h2>
          <div className="relative pl-6 space-y-6" style={{ borderLeft: `1px solid ${meta.color}30` }}>
            {article.timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="relative"
              >
                <div
                  className="absolute -left-[27px] w-3 h-3 rounded-full"
                  style={{ background: meta.color, boxShadow: `0 0 8px ${meta.glow}` }}
                />
                <div className="text-xs font-mono mb-1" style={{ color: meta.color }}>{t.year}</div>
                <div className="text-sm" style={{ color: "rgba(250,240,220,0.7)" }}>{t.event}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Body — first half */}
        <div className="prose-custom">{renderBody(beforeMid)}</div>

        {/* Pull quote at midpoint */}
        <blockquote className="pull-quote my-12">
          {pullQuoteText}
        </blockquote>

        {/* Body — second half */}
        <div className="prose-custom">{renderBody(afterMid)}</div>

        {/* Ornamental divider */}
        <div className="divider-orn my-14">
          <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
        </div>

        {/* Fast Facts — styled card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-16 p-8 rounded-xl parallax-section"
          style={{
            background: "linear-gradient(135deg, rgba(28,21,16,0.9), rgba(20,16,9,0.95))",
            border:     `1px solid ${meta.color}30`,
            boxShadow:  `0 0 40px ${meta.glow}`,
          }}
        >
          <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: "#FAF0DC" }}>
            Fast Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.fast_facts.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg font-bold mt-0.5" style={{ color: meta.color }}>•</span>
                <span className="text-sm" style={{ color: "rgba(250,240,220,0.75)" }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Then vs Now */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="my-16 parallax-section"
        >
          <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: "#FAF0DC" }}>
            Then vs. Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-6 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border:     `1px solid ${meta.color}20`,
              }}
            >
              <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: meta.color }}>
                In {article.common_vs_exotic.origin_country}
              </div>
              <p className="text-sm" style={{ color: "rgba(250,240,220,0.75)" }}>
                {article.common_vs_exotic.origin_use}
              </p>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border:     "1px solid rgba(194,75,42,0.2)",
              }}
            >
              <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "#C24B2A" }}>
                In the West
              </div>
              <p className="text-sm" style={{ color: "rgba(250,240,220,0.75)" }}>
                {article.common_vs_exotic.western_use}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── YouTube documentary ──────────────────────────────────────────── */}
        <YouTubeSection article={article} />

        {/* ── Feature 8: Flavor Web ────────────────────────────────────────── */}
        <FlavorWeb food={article.food} />

        {/* ── Feature 2: Go Deeper ─────────────────────────────────────────── */}
        <GoDeeper article={article} />

        {/* ── Feature 6: Affiliate Products ───────────────────────────────── */}
        <AffiliateProducts article={article} />

        {/* ── Feature 5: Share Card ────────────────────────────────────────── */}
        <ShareCard article={article} />

        {/* ── Feature 3: Digest Signup ─────────────────────────────────────── */}
        <div className="divider-orn my-12">
          <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
        </div>
        <DigestSignup />
      </article>

      {/* Related articles */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="divider-orn mb-10">
          <span className="font-serif text-lg" style={{ color: "#D4A853" }}>✦</span>
        </div>
        <h2 className="font-serif text-2xl font-bold mb-8" style={{ color: "#FAF0DC" }}>
          You might also like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
