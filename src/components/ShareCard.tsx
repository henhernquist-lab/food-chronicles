import { useRef, useState } from "react";
import { Article } from "@/data/articles";

interface ShareCardProps {
  article: Article;
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas share image generator
// ─────────────────────────────────────────────────────────────────────────────
function generateShareImage(article: Article): Promise<Blob> {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "var(--bg-dark)";
    ctx.fillRect(0, 0, 1080, 1080);

    // Subtle vignette gradient
    const vignette = ctx.createRadialGradient(540, 540, 200, 540, 540, 760);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.6)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold top bar
    const goldGrad = ctx.createLinearGradient(0, 0, 1080, 0);
    goldGrad.addColorStop(0, "transparent");
    goldGrad.addColorStop(0.3, "var(--gold-share)");
    goldGrad.addColorStop(0.7, "var(--gold-share)");
    goldGrad.addColorStop(1, "transparent");
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, 1080, 3);

    // Emoji (large, centered)
    ctx.font = "160px serif";
    ctx.textAlign = "center";
    ctx.fillText(article.emoji, 540, 340);

    // Title
    ctx.fillStyle = "var(--text-light)";
    ctx.font = "bold 56px 'Georgia', serif";
    ctx.textAlign = "center";
    const titleWords = article.title.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of titleWords) {
      const test = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(test).width > 900) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);
    lines.forEach((line, i) => ctx.fillText(line, 540, 440 + i * 68));

    // Most shocking fast fact (gold)
    const fact = article.fast_facts[0] ?? article.teaser;
    ctx.fillStyle = "var(--gold-share)";
    ctx.font = "italic 32px 'Georgia', serif";
    ctx.textAlign = "center";
    const factWords = fact.split(" ");
    const factLines: string[] = [];
    let fLine = "";
    for (const word of factWords) {
      const test = fLine ? `${fLine} ${word}` : word;
      if (ctx.measureText(test).width > 860) {
        factLines.push(fLine);
        fLine = word;
      } else {
        fLine = test;
      }
    }
    if (fLine) factLines.push(fLine);
    const factY = 440 + lines.length * 68 + 60;
    factLines.forEach((line, i) => ctx.fillText(line, 540, factY + i * 44));

    // Gold divider
    ctx.strokeStyle = "rgba(201,168,76,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, factY + factLines.length * 44 + 30);
    ctx.lineTo(880, factY + factLines.length * 44 + 30);
    ctx.stroke();

    // Branding
    ctx.fillStyle = "var(--gold-share)";
    ctx.font = "bold 28px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("THE FOOD CHRONICLE", 540, 980);

    // URL watermark
    ctx.fillStyle = "rgba(201,168,76,0.5)";
    ctx.font = "18px 'Georgia', serif";
    ctx.fillText("thefoodchronicle.com", 540, 1015);

    canvas.toBlob(blob => resolve(blob!), "image/png");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function ShareCard({ article }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareCount] = useState<number>(() => {
    try {
      const key = `shares_${article.slug}`;
      return parseInt(localStorage.getItem(key) ?? "0", 10);
    } catch {
      return 0;
    }
  });

  const trackShare = () => {
    try {
      const key = `shares_${article.slug}`;
      const count = parseInt(localStorage.getItem(key) ?? "0", 10) + 1;
      localStorage.setItem(key, String(count));
    } catch {
      // ignore
    }
  };

  const handleDownloadImage = async () => {
    const blob = await generateShareImage(article);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.slug}-food-chronicle.png`;
    a.click();
    URL.revokeObjectURL(url);
    trackShare();
  };

  const handleShareX = () => {
    const fact = article.fast_facts[0] ?? article.teaser;
    const url = window.location.href.split("?")[0] + "?ref=share";
    const tweet = `"${fact}" 🤯\n\nThe insane history of ${article.food}: ${url}\n\nvia @FoodChronicle #FoodHistory #DidYouKnow`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      "_blank"
    );
    trackShare();
  };

  const handleCopyLink = () => {
    const url = window.location.href.split("?")[0] + "?ref=share";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackShare();
    });
  };

  const handleNativeShare = async () => {
    const url = window.location.href.split("?")[0] + "?ref=share";
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.fast_facts[0] ?? article.teaser,
        url,
      });
      trackShare();
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="my-16">
      <div className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-foreground">
          Share This Story
        </h2>
        {shareCount >= 10 && (
          <p className="text-sm text-primary mt-1">
            🔥 {shareCount} people shared this story
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Download share image */}
        <button
          onClick={handleDownloadImage}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(24 15% 14%)",
            border: "1px solid rgba(212,168,83,0.25)",
            color: "hsl(36 25% 85%)",
          }}
        >
          📸 Share Image
        </button>

        {/* Share on X */}
        <button
          onClick={handleShareX}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(24 15% 14%)",
            border: "1px solid rgba(212,168,83,0.25)",
            color: "hsl(36 25% 85%)",
          }}
        >
          𝕏 Share on X
        </button>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(24 15% 14%)",
            border: "1px solid rgba(212,168,83,0.25)",
            color: "hsl(36 25% 85%)",
          }}
        >
          {copied ? "✓ Copied!" : "🔗 Copy Link"}
        </button>

        {/* Native share */}
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
          style={{
            background: "hsl(24 15% 14%)",
            border: "1px solid rgba(212,168,83,0.25)",
            color: "hsl(36 25% 85%)",
          }}
        >
          📱 Share
        </button>
      </div>
    </section>
  );
}
