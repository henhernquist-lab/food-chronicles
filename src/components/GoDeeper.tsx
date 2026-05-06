import { useState } from "react";
import { Article } from "@/data/articles";

interface ExpansionCard {
  question: string;
  answer: string;
}

interface GoDeeperProps {
  article: Article;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily usage tracking (3 expansions per day for free users)
// ─────────────────────────────────────────────────────────────────────────────
const DAILY_LIMIT = 3;

function getExpansionUsage(): number {
  try {
    const stored = localStorage.getItem("expansion_usage");
    if (!stored) return 0;
    const { date, count } = JSON.parse(stored);
    if (date !== new Date().toDateString()) return 0;
    return count as number;
  } catch {
    return 0;
  }
}

function incrementExpansionUsage(): void {
  try {
    const count = getExpansionUsage() + 1;
    localStorage.setItem(
      "expansion_usage",
      JSON.stringify({ date: new Date().toDateString(), count })
    );
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Suggestion chips derived from the article's food name
// ─────────────────────────────────────────────────────────────────────────────
function buildChips(article: Article): string[] {
  const f = article.food;
  const era = article.timeline[Math.floor(article.timeline.length / 2)]?.year ?? "ancient times";
  const country = article.world_spread[0]?.country ?? "its origin country";
  return [
    `How did ${f} affect the economy?`,
    `What happened to the people who traded ${f}?`,
    `Tell me more about ${f} in ${era}`,
    `What does ${f} mean culturally in ${country}?`,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function GoDeeper({ article }: GoDeeperProps) {
  const [question, setQuestion] = useState("");
  const [expansions, setExpansions] = useState<ExpansionCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(getExpansionUsage);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const chips = buildChips(article);
  const articleSummary = article.body.split(" ").slice(0, 200).join(" ");
  const remaining = DAILY_LIMIT - usageCount;
  // Per-article thread limit: 3 follow-ups
  const threadLimit = 3;

  const expand = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading || remaining <= 0 || expansions.length >= threadLimit) return;

    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
      if (!apiKey) throw new Error("No API key");

      const systemPrompt = `You are a food historian expanding on a specific article from The Food Chronicle.

Article topic: ${article.food}
Article summary: ${articleSummary}

Write a focused 150-200 word expansion that:
- Directly answers their question with specific historical facts
- Includes at least one date, name, or place for credibility
- Connects back to the main article topic
- Ends with a thought-provoking follow-up question to keep them curious

Write in the same voice as The Food Chronicle — fascinating, punchy, slightly dramatic. Never be vague or generic.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022",
          max_tokens: 400,
          system: systemPrompt,
          messages: [{ role: "user", content: trimmed }],
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const answer = data.content?.[0]?.text ?? "No expansion available right now.";

      setExpansions(prev => [...prev, { question: trimmed, answer }]);
      incrementExpansionUsage();
      setUsageCount(getExpansionUsage());
    } catch {
      setExpansions(prev => [
        ...prev,
        {
          question: trimmed,
          answer:
            "📖 Expansion unavailable. Please add your VITE_ANTHROPIC_API_KEY to enable AI expansions.",
        },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  const handleSave = (idx: number) => {
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 2000);
  };

  const handleShare = (content: string, idx: number) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  return (
    <section className="my-16">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Go Deeper 🔍</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ask anything about {article.food} and get a focused historical expansion.
          {remaining > 0 ? ` ${remaining} of ${DAILY_LIMIT} free expansions remaining today.` : " Daily limit reached."}
        </p>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map(chip => (
          <button
            key={chip}
            onClick={() => expand(chip)}
            disabled={loading || remaining <= 0 || expansions.length >= threadLimit}
            className="px-3 py-1.5 text-xs rounded-sm transition-colors disabled:opacity-40"
            style={{
              background: "hsl(24 15% 12%)",
              color: "hsl(40 55% 65%)",
              border: "1px solid rgba(212,168,83,0.2)",
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === "Enter" && expand(question)}
          placeholder="What do you want to know more about?"
          disabled={loading || remaining <= 0 || expansions.length >= threadLimit}
          className="flex-1 bg-secondary border border-border rounded-sm px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-40"
        />
        <button
          onClick={() => expand(question)}
          disabled={!question.trim() || loading || remaining <= 0 || expansions.length >= threadLimit}
          className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "…" : "Expand"}
        </button>
      </div>

      {/* Expansion cards */}
      <div className="space-y-4">
        {expansions.map((exp, i) => (
          <div
            key={i}
            className="rounded-sm p-6"
            style={{
              background: "hsl(24 15% 8%)",
              border: "1px solid rgba(212,168,83,0.15)",
            }}
          >
            {/* Label */}
            <div
              className="text-xs font-medium mb-3 tracking-wider uppercase"
              style={{ color: "hsl(40 55% 58%)" }}
            >
              📖 Food Chronicle Deep Dive
            </div>
            {/* Question */}
            <p className="text-xs text-muted-foreground mb-3 italic">"{exp.question}"</p>
            {/* Answer */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "hsl(36 25% 85%)" }}
            >
              {exp.answer}
            </p>
            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleShare(exp.answer, i)}
                className="text-xs transition-opacity hover:opacity-80"
                style={{ color: "hsl(40 55% 58%)" }}
              >
                {copiedIdx === i ? "✓ Copied!" : "📤 Share this"}
              </button>
              <button
                onClick={() => handleSave(i)}
                className="text-xs transition-opacity hover:opacity-80"
                style={{ color: "hsl(40 55% 58%)" }}
              >
                {savedIdx === i ? "✓ Saved!" : "🔖 Save to my reads"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Thread limit notice */}
      {expansions.length >= threadLimit && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          You've reached the 3-expansion thread limit for this article.
        </p>
      )}
    </section>
  );
}
