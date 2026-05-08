import { Link } from "react-router-dom";
import { articleImages } from "@/data/articleImages";
import type { Article } from "@/data/articles";

const categoryColors: Record<string, string> = {
  "Common Foods": "bg-primary/20 text-primary",
  "Exotic Foods": "bg-accent/20 text-accent",
  "Spices": "bg-accent/20 text-accent",
  "Drinks": "bg-herb/20 text-herb",
  "Ancient Foods": "bg-primary/20 text-primary",
};

export function ArticleCard({ article, featured = false, delay = 0 }: { article: Article; featured?: boolean; delay?: number }) {
  const img = articleImages[article.slug];
  return (
    <Link
      to={`/article/${article.slug}`}
      className={`group block article-card ${featured ? "featured-card" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] article-card-image">
        <img
          src={img}
          alt={article.title}
          loading="lazy"
          width={1280}
          height={720}
          className="w-full aspect-[16/10] object-cover article-card-media"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent" />
      </div>
      <div className="mt-4 space-y-3 p-4 md:p-5">
        <div className="flex items-center gap-3">
          <span className={`category-badge text-xs font-medium px-2 py-0.5 rounded-sm ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground">8 min read</span>
        </div>
        <h3 className={`article-title font-serif font-bold leading-tight transition-all ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
          <span className="card-emoji inline-block mr-2">{article.emoji}</span>
          {article.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{article.teaser}</p>
      </div>
    </Link>
  );
}