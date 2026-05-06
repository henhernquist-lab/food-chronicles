import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { articles, categories } from "@/data/articles";
import { articleImages } from "@/data/articleImages";
import { ArticleCard } from "@/components/ArticleCard";
import { KitchenModeToggle } from "@/components/KitchenModeToggle";
import { DigestSignup } from "@/components/DigestSignup";
import { Search, Dice5 } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.food.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const hero = filtered[0];
  const rest = filtered.slice(1);

  const randomArticle = () => {
    const rand = articles[Math.floor(Math.random() * articles.length)];
    navigate(`/article/${rand.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Masthead */}
      <header className="border-b border-border/50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Top bar: Kitchen Mode toggle + Suggest a Food link */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/suggest"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              📬 Suggest a Food
            </Link>
            <KitchenModeToggle />
          </div>

          {/* Masthead title */}
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-gold-gradient">
              THE FOOD CHRONICLE
            </h1>
            <div className="w-48 h-px mx-auto mt-3 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mt-3 text-muted-foreground text-sm tracking-[0.2em] uppercase">
              The hidden histories of what you eat
            </p>
          </div>
        </div>
      </header>

      {/* Search & Controls */}
      <div className="container max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search food histories..."
            className="w-full bg-secondary border border-border rounded-sm pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{articles.length} food histories</span>
          <button onClick={randomArticle} className="p-2 rounded-sm bg-secondary hover:bg-primary/20 transition-colors" title="Random article">
            <Dice5 className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container max-w-6xl mx-auto px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-sm whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Article */}
      {hero && (
        <div className="container max-w-6xl mx-auto px-4 pb-12">
          <Link to={`/article/${hero.slug}`} className="group block">
            <div className="relative overflow-hidden rounded-sm">
              <img src={articleImages[hero.slug]} alt={hero.title} width={1280} height={720} className="w-full aspect-[21/9] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary/30 text-primary rounded-sm mb-3">{hero.category}</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-3">
                  {hero.emoji} {hero.title}
                </h2>
                <p className="text-muted-foreground max-w-2xl text-sm md:text-base">{hero.teaser}</p>
                <span className="inline-block mt-4 text-primary text-sm font-medium">Read the full story →</span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Article Grid */}
      <div className="container max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map(a => <ArticleCard key={a.id} article={a} />)}
        </div>
      </div>

      {/* Newsletter / Footer */}
      <div className="border-t border-border/50 py-16">
        <div className="container max-w-3xl mx-auto px-4">
          <DigestSignup />
          <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/suggest" className="hover:text-primary transition-colors">📬 Suggest a Food</Link>
            <span>·</span>
            <Link to="/suggest" className="hover:text-primary transition-colors">📋 Coming Soon</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
