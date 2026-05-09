import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { articleImages } from "@/data/articleImages";
import type { Article } from "@/data/articles";

// Category → color + glow (mirrors food-chronicles1 categoryMeta palette)
const CATEGORY_META: Record<string, { color: string; glow: string; label: string }> = {
  "Common Foods": { color: "#D4A853", glow: "rgba(212,168,83,0.45)",  label: "Common Foods" },
  "Exotic Foods": { color: "#C24B2A", glow: "rgba(194,75,42,0.45)",   label: "Exotic Foods" },
  "Spices":       { color: "#E6A53C", glow: "rgba(230,165,60,0.5)",   label: "Spices"       },
  "Drinks":       { color: "#4A7C82", glow: "rgba(74,124,130,0.5)",   label: "Drinks"       },
  "Ancient Foods":{ color: "#9B59B6", glow: "rgba(155,89,182,0.45)",  label: "Ancient Foods"},
  "Food History": { color: "#D4A853", glow: "rgba(212,168,83,0.45)",  label: "Food History" },
};

const defaultMeta = { color: "#D4A853", glow: "rgba(212,168,83,0.4)", label: "" };

export function ArticleCard({
  article,
  index = 0,
  featured = false,
}: {
  article: Article;
  index?: number;
  featured?: boolean;
}) {
  const img  = articleImages[article.slug];
  const meta = CATEGORY_META[article.category] ?? defaultMeta;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="article-card glass-card relative overflow-hidden rounded-xl group"
      style={
        {
          "--cat-color": meta.color,
          "--cat-glow":  meta.glow,
        } as React.CSSProperties
      }
    >
      <Link to={`/article/${article.slug}`} className="block">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
          <img
            src={img}
            alt={article.title}
            loading="lazy"
            className="kenburns w-full h-full object-cover"
          />
          {/* gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,10,8,0) 35%, rgba(12,10,8,0.85) 100%)",
            }}
          />
          {/* category badge */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-mono cat-tag-pulse backdrop-blur"
            style={{
              color:      meta.color,
              border:     `1px solid ${meta.color}80`,
              background: "rgba(12,10,8,0.6)",
              boxShadow:  `0 0 18px ${meta.glow}`,
            }}
          >
            {meta.label || article.category}
          </div>
          {/* emoji */}
          <div
            className="food-emoji absolute top-4 right-4 select-none"
            style={{
              fontSize: "2.6rem",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.6))",
            }}
          >
            {article.emoji}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 relative">
          <h3
            className={`font-serif font-bold leading-tight text-cream mb-2 ${
              featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}
          >
            <span className="title-underline">{article.title}</span>
          </h3>
          <p className="text-cream/60 text-sm md:text-[15px] leading-relaxed line-clamp-3">
            {article.teaser}
          </p>

          <div className="mt-5 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-cream/45">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cream/10"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <BookOpen size={12} />
              8 min read
            </span>
            <span className="inline-flex items-center gap-1 text-gold-warm/70 group-hover:text-gold-warm transition-colors">
              Read <ArrowUpRight size={13} />
            </span>
          </div>
        </div>
      </Link>

      {/* hover glow border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `0 25px 60px var(--cat-glow), inset 0 0 0 1px var(--cat-color)`,
        }}
      />
    </motion.div>
  );
}
