import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
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

  const [tagline, setTagline] = useState("");
  const fullTagline = "The hidden histories of what you eat";

  const hero = filtered[0];
  const rest = filtered.slice(1);

  const [heroTitleChars, setHeroTitleChars] = useState<string[]>([]);

  const randomArticle = () => {
    const rand = articles[Math.floor(Math.random() * articles.length)];
    navigate(`/article/${rand.slug}`);
  };

  useEffect(() => {
    if (hero) {
      setHeroTitleChars(hero.title.split(""));
    }
  }, [hero]);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      setTagline(fullTagline.slice(0, index + 1));
      index += 1;
      if (index >= fullTagline.length) {
        window.clearInterval(interval);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.from(".article-card", {
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
      delay: 0.3,
    });

    gsap.from(".hero-title-char", {
      y: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: "power2.out",
      delay: 0.5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Masthead */}
      <header className="border-b border-border/50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Top bar: Kitchen Mode toggle + Suggest a Food link */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/suggest"
              className="text-xs text-muted-foreground hover:text-primary transition-colors interactive"
            >
              📬 Suggest a Food
            </Link>
            <KitchenModeToggle />
          </div>

          {/* Masthead title */}
          <div className="text-center">
            <h1 className="masthead-title font-serif text-4xl md:text-6xl font-bold tracking-tight text-gold-gradient">
              THE FOOD CHRONICLE
            </h1>
            <div className="w-48 h-px mx-auto mt-3 gold-underline-animated" />
            <p className="mt-3 text-muted-foreground text-sm tracking-[0.2em] uppercase typewriter-tagline">
              {tagline}
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
          <button onClick={randomArticle} className="p-2 rounded-sm bg-secondary hover:bg-primary/20 transition-colors interactive" title="Random article">
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
              className={`px-4 py-1.5 text-xs font-medium rounded-sm whitespace-nowrap transition-colors interactive ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Article */}
      {hero && (
        <div className="container max-w-6xl mx-auto px-4 pb-12">
          <Link to={`/article/${hero.slug}`} className="group block interactive hero-featured">
            <div className="relative overflow-hidden rounded-[2rem] min-h-[75vh] hero-hero-image">
              <img
                src={articleImages[hero.slug]}
                alt={hero.title}
                width={1280}
                height={720}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(12,10,8,0.5)_60%,rgba(12,10,8,0.98)_100%)]" />
              <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(to_right,rgba(12,10,8,0.4)_0%,transparent_30%,transparent_70%,rgba(12,10,8,0.4)_100%)]" />
              <div className="absolute inset-0 hero-vignette pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/20 to-black/90" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 hero-copy">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold-soft bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold">
                  <span className="live-dot" /> TODAY&apos;S STORY
                </span>
                <h2 className="mt-6 flex flex-wrap gap-1 text-4xl md:text-6xl font-serif font-bold leading-tight text-foreground hero-title">
                  {heroTitleChars.map((letter, index) => (
                    <span key={`${hero.slug}-${index}`} className="hero-title-char inline-block">{letter}</span>
                  ))}
                </h2>
                <p className="mt-4 max-w-3xl text-muted-foreground text-base md:text-lg">{hero.teaser}</p>
                <span className="hero-cta inline-flex mt-6 rounded-full border border-gold-soft bg-transparent px-6 py-3 text-sm font-semibold text-gold transition-all duration-300">
                  Read the full story
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Article Grid */}
      <div className="container max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((a, index) => (
            <ArticleCard key={a.id} article={a} delay={index * 100} />
          ))}
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
