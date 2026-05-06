import { useEffect, useRef, useState } from "react";
import { articles } from "@/data/articles";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daily rotating suggestion chips (rotates based on day-of-year)
// ─────────────────────────────────────────────────────────────────────────────
const ALL_CHIPS = [
  "I'm making pasta 🍝",
  "Tell me about coffee ☕",
  "What's the history of hot sauce? 🌶️",
  "I'm eating sushi 🍱",
  "Tell me about bread 🍞",
  "What's the story of salt? 🧂",
  "I'm cooking with vanilla 🍦",
  "Tell me about avocados 🥑",
  "What's the history of tea? 🍵",
  "I'm eating chocolate 🍫",
  "Tell me about pizza 🍕",
  "What's the story of bananas? 🍌",
];

function getDailyChips(): string[] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const start = (dayOfYear * 4) % ALL_CHIPS.length;
  return [
    ALL_CHIPS[start % ALL_CHIPS.length],
    ALL_CHIPS[(start + 1) % ALL_CHIPS.length],
    ALL_CHIPS[(start + 2) % ALL_CHIPS.length],
    ALL_CHIPS[(start + 3) % ALL_CHIPS.length],
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude system prompt
// ─────────────────────────────────────────────────────────────────────────────
const SOMMELIER_SYSTEM = `You are The Food Sommelier — a witty, deeply knowledgeable food historian who knows the fascinating hidden history of every ingredient on earth.

When a user describes what they're eating or cooking, respond with:
1. A brief surprising fact about the main ingredient (1-2 sentences)
2. The origin story of that food in 2-3 sentences
3. One completely unexpected historical connection
4. A "Did you know?" fact that will blow their mind

Be conversational, warm, and slightly dramatic — like a passionate chef who moonlights as a history professor. Use food emojis naturally.
Keep total response under 200 words — punchy and fascinating.

If multiple ingredients are mentioned cover the most historically interesting one first then briefly mention the others.

SITE ARTICLES (use these slugs to build links like /article/[slug]):
${articles.map(a => `- ${a.food}: /article/${a.slug}`).join("\n")}

End every response with: "Want the full deep dive? [link to relevant article if it exists on the site, otherwise say 'Coming soon to The Food Chronicle']"`;

// ─────────────────────────────────────────────────────────────────────────────
// Session usage tracking (5 per day for free users)
// ─────────────────────────────────────────────────────────────────────────────
const DAILY_LIMIT = 5;

function getUsageToday(): number {
  try {
    const stored = localStorage.getItem("sommelier_usage");
    if (!stored) return 0;
    const { date, count } = JSON.parse(stored);
    if (date !== new Date().toDateString()) return 0;
    return count as number;
  } catch {
    return 0;
  }
}

function incrementUsage(): void {
  try {
    const count = getUsageToday() + 1;
    localStorage.setItem(
      "sommelier_usage",
      JSON.stringify({ date: new Date().toDateString(), count })
    );
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function FoodSommelier() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [usageCount, setUsageCount] = useState(getUsageToday);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chips = getDailyChips();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    if (usageCount >= DAILY_LIMIT) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
      if (!apiKey) throw new Error("No API key");

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
          system: SOMMELIER_SYSTEM,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "I couldn't find any history on that — try another ingredient!";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      incrementUsage();
      setUsageCount(getUsageToday());
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "🍷 The sommelier is temporarily unavailable. Please add your VITE_ANTHROPIC_API_KEY to enable AI responses.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyFact = (content: string, idx: number) => {
    // Extract the most interesting sentence (first sentence after the first emoji line)
    const sentences = content.split(/(?<=[.!?])\s+/);
    const fact = sentences.find(s => s.length > 30) ?? sentences[0];
    navigator.clipboard.writeText(fact).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const remaining = DAILY_LIMIT - usageCount;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Food Sommelier"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, hsl(40 55% 40%), hsl(40 55% 28%))",
          color: "hsl(40 55% 88%)",
          border: "1px solid rgba(212,168,83,0.4)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,83,0.1)",
        }}
      >
        🍷 <span className="hidden sm:inline">Ask the Sommelier</span>
      </button>

      {/* ── Slide-up chat drawer ── */}
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm rounded-lg overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: "hsl(24 18% 7%)",
            border: "1px solid rgba(212,168,83,0.2)",
            height: "min(560px, 80vh)",
            animation: "slideUp 0.25s ease-out",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "rgba(212,168,83,0.15)" }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🍷</span>
                <span
                  className="font-serif font-bold text-sm"
                  style={{ color: "hsl(40 55% 70%)" }}
                >
                  The Food Sommelier
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "hsl(30 10% 50%)" }}>
                Your personal food historian
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "hsl(30 10% 45%)" }}>
                {remaining}/{DAILY_LIMIT} left
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🍷</div>
                <p className="text-sm" style={{ color: "hsl(30 10% 55%)" }}>
                  Describe what you're eating or cooking and I'll uncover its hidden history.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "hsl(40 55% 30%)",
                          color: "hsl(40 55% 92%)",
                        }
                      : {
                          background: "hsl(24 15% 12%)",
                          color: "hsl(36 25% 85%)",
                          border: "1px solid rgba(212,168,83,0.1)",
                        }
                  }
                >
                  <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => copyFact(msg.content, i)}
                      className="mt-2 text-xs opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: "hsl(40 55% 65%)" }}
                    >
                      {copiedIdx === i ? "✓ Copied!" : "📋 Share this fact"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{
                    background: "hsl(24 15% 12%)",
                    color: "hsl(40 55% 65%)",
                    border: "1px solid rgba(212,168,83,0.1)",
                  }}
                >
                  🍷 Consulting the cellar…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Daily limit reached */}
          {remaining <= 0 && (
            <div
              className="px-4 py-3 text-xs text-center border-t"
              style={{
                borderColor: "rgba(212,168,83,0.15)",
                color: "hsl(30 10% 50%)",
              }}
            >
              You've used your 5 free sessions today. Upgrade to Premium for unlimited access.
            </div>
          )}

          {/* Suggestion chips */}
          {messages.length === 0 && remaining > 0 && (
            <div
              className="px-3 pb-2 flex flex-wrap gap-1.5 border-t pt-2"
              style={{ borderColor: "rgba(212,168,83,0.1)" }}
            >
              {chips.map(chip => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-2 py-1 text-xs rounded-full transition-colors"
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
          )}

          {/* Input */}
          <div
            className="flex gap-2 p-3 border-t"
            style={{ borderColor: "rgba(212,168,83,0.15)" }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Describe what you're eating or cooking…"
              disabled={remaining <= 0 || loading}
              className="flex-1 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1"
              style={{
                background: "hsl(24 15% 10%)",
                color: "hsl(36 25% 88%)",
                border: "1px solid rgba(212,168,83,0.2)",
                "--tw-ring-color": "hsl(40 55% 45%)",
              } as React.CSSProperties}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || remaining <= 0 || loading}
              className="px-3 py-2 rounded-sm text-sm font-medium transition-opacity disabled:opacity-40"
              style={{
                background: "hsl(40 55% 42%)",
                color: "hsl(24 18% 4%)",
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Slide-up keyframe */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
