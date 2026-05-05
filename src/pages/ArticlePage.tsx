import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { articleImages } from "@/data/articleImages";
import { ArticleCard } from "@/components/ArticleCard";
import { useEffect, useState } from "react";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug || "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!article) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Article not found. <Link to="/" className="text-primary ml-2">Go home</Link></div>;

  const related = getRelatedArticles(article.slug);
  const img = articleImages[article.slug];

  const renderBody = (body: string) => {
    return body.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="font-serif text-2xl font-bold mt-12 mb-4 text-foreground">{line.replace("## ", "")}</h2>;
      if (line.trim() === "") return null;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: line.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\"(.*?)\"/g, "&ldquo;$1&rdquo;") }} />;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50"><div className="h-full reading-progress transition-all duration-150" style={{ width: `${progress}%` }} /></div>

      <Link to="/" className="fixed top-4 left-4 z-40 text-xs text-muted-foreground hover:text-primary transition-colors">← Back</Link>

      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={img} alt={article.title} className="w-full h-full object-cover" width={1280} height={720} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-4xl mx-auto">
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/30 text-primary rounded-sm mb-3">{article.category}</span>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">{article.emoji} {article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>The Food Chronicle AI</span><span>·</span><span>8 min read</span><span>·</span><span>{new Date(article.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 md:px-8 py-12">
        {/* Hook */}
        <div className="text-lg leading-relaxed text-foreground/90 space-y-4 mb-12 border-l-2 border-primary pl-6">
          {article.hook.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Timeline */}
        <div className="my-16">
          <h2 className="font-serif text-2xl font-bold mb-8 text-foreground">Timeline</h2>
          <div className="relative pl-6 border-l border-primary/30 space-y-6">
            {article.timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-primary" />
                <div className="text-xs font-mono text-primary mb-1">{t.year}</div>
                <div className="text-sm text-muted-foreground">{t.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="prose-custom">{renderBody(article.body)}</div>

        {/* Fast Facts */}
        <div className="my-16 p-8 bg-secondary rounded-sm border border-border">
          <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Fast Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.fast_facts.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary text-lg font-bold mt-0.5">•</span>
                <span className="text-sm text-foreground/80">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common vs Exotic */}
        <div className="my-16">
          <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">Then vs. Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-secondary rounded-sm border border-border">
              <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">In {article.common_vs_exotic.origin_country}</div>
              <p className="text-sm text-foreground/80">{article.common_vs_exotic.origin_use}</p>
            </div>
            <div className="p-6 bg-secondary rounded-sm border border-border">
              <div className="text-xs text-accent font-medium mb-2 uppercase tracking-wider">In the West</div>
              <p className="text-sm text-foreground/80">{article.common_vs_exotic.western_use}</p>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="my-16 flex gap-3">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just learned that ${article.teaser} 🤯`)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-secondary text-sm text-foreground rounded-sm hover:bg-primary/20 transition-colors">Share on X</a>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="px-4 py-2 bg-secondary text-sm text-foreground rounded-sm hover:bg-primary/20 transition-colors">Copy link</button>
        </div>
      </article>

      {/* Related */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-serif text-2xl font-bold mb-8 text-foreground">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      </div>
    </div>
  );
}