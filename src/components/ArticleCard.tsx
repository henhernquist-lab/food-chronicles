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

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const img = articleImages[article.slug];
  return (
    <Link to={`/article/${article.slug}`} className={`group block ${featured ? "" : ""}`}>
      <div className="overflow-hidden rounded-sm">
        <img
          src={img}
          alt={article.title}
          loading="lazy"
          width={1280}
          height={720}
          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground">8 min read</span>
        </div>
        <h3 className={`font-serif font-bold leading-tight group-hover:text-primary transition-colors ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>
          {article.emoji} {article.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{article.teaser}</p>
      </div>
    </Link>
  );
}