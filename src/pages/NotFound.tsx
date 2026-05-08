import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { articles } from "@/data/articles";

const foodEmojis = ["🍕", "🍔", "🍟", "🌭", "🍿", "🥓", "🥩", "🍗", "🍖", "🌯", "🌮", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥙", "🌭", "🍢", "🍡", "🍧", "🍨", "🍦", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🥠", "🥮", "🍯", "🧁", "🥧", "🍰", "🍪", "🍫", "🍬", "🍭", "🍮", "🎂", "🍰", "🧁", "🥧", "🍪", "🍫"];

const NotFound = () => {
  const location = useLocation();
  const [currentEmoji, setCurrentEmoji] = useState(foodEmojis[0]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(foodEmojis[Math.floor(Math.random() * foodEmojis.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const randomArticle = articles[Math.floor(Math.random() * articles.length)];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background rotating emojis */}
      <div className="absolute inset-0 opacity-10">
        {foodEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10">
        <div className="text-9xl mb-8 animate-bounce">{currentEmoji}</div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">This dish does not exist yet</h1>
        <p className="mb-8 text-xl text-muted-foreground">But we have plenty of other food histories waiting</p>
        <Link
          to={`/article/${randomArticle.slug}`}
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors interactive"
        >
          Take me somewhere delicious
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
