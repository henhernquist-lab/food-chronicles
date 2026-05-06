import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Submission {
  id: string;
  food: string;
  reason: string;
  email: string;
  votes: number;
  status: "approved" | "pending";
  votedIPs: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed data — approved public submissions
// ─────────────────────────────────────────────────────────────────────────────
const SEED_SUBMISSIONS: Submission[] = [
  { id: "s1", food: "Saffron", reason: "The most expensive spice in the world — why?", email: "", votes: 142, status: "approved", votedIPs: [] },
  { id: "s2", food: "Oysters", reason: "They used to be poor people's food in London", email: "", votes: 98, status: "approved", votedIPs: [] },
  { id: "s3", food: "Ketchup", reason: "It started as a fish sauce in China", email: "", votes: 87, status: "approved", votedIPs: [] },
  { id: "s4", food: "Maple Syrup", reason: "Indigenous peoples invented it — Europeans had no idea", email: "", votes: 74, status: "approved", votedIPs: [] },
  { id: "s5", food: "Lobster", reason: "It was fed to prisoners — considered trash food", email: "", votes: 61, status: "approved", votedIPs: [] },
];

function loadSubmissions(): Submission[] {
  try {
    const stored = localStorage.getItem("fc_submissions");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return SEED_SUBMISSIONS;
}

function saveSubmissions(subs: Submission[]): void {
  try {
    localStorage.setItem("fc_submissions", JSON.stringify(subs));
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude food validation
// ─────────────────────────────────────────────────────────────────────────────
async function isActuallyFood(name: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!apiKey) return true; // if no key, allow submission

  try {
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
        max_tokens: 5,
        messages: [
          {
            role: "user",
            content: `Is "${name}" a food, ingredient, or drink? Reply only: yes or no`,
          },
        ],
      }),
    });
    if (!res.ok) return true;
    const data = await res.json();
    const reply = (data.content?.[0]?.text ?? "yes").toLowerCase().trim();
    return reply.startsWith("yes");
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────
export default function SuggestPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(loadSubmissions);
  const [food, setFood] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"success" | "rejected" | "error" | null>(null);

  // Pseudo-IP using a session fingerprint
  const sessionId = (() => {
    try {
      let id = sessionStorage.getItem("fc_session_id");
      if (!id) {
        id = Math.random().toString(36).slice(2);
        sessionStorage.setItem("fc_session_id", id);
      }
      return id;
    } catch {
      return "anon";
    }
  })();

  const approved = submissions
    .filter(s => s.status === "approved")
    .sort((a, b) => b.votes - a.votes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!food.trim() || submitting) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const valid = await isActuallyFood(food.trim());
      if (!valid) {
        setSubmitResult("rejected");
        setSubmitting(false);
        return;
      }

      const newSub: Submission = {
        id: `s${Date.now()}`,
        food: food.trim(),
        reason: reason.trim().slice(0, 200),
        email: email.trim(),
        votes: 0,
        status: "pending",
        votedIPs: [],
      };

      const updated = [...submissions, newSub];
      setSubmissions(updated);
      saveSubmissions(updated);
      setSubmitResult("success");
      setFood("");
      setReason("");
      setEmail("");
    } catch {
      setSubmitResult("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = (id: string) => {
    const updated = submissions.map(s => {
      if (s.id !== id) return s;
      if (s.votedIPs.includes(sessionId)) return s; // already voted
      return { ...s, votes: s.votes + 1, votedIPs: [...s.votedIPs, sessionId] };
    });
    setSubmissions(updated);
    saveSubmissions(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to The Food Chronicle
          </Link>
          <div className="text-center mt-6">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">
              Suggest a Food 📬
            </h1>
            <div className="w-48 h-px mx-auto mt-3 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mt-3 text-muted-foreground text-sm">
              What food's hidden history should we uncover next?
            </p>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Submission form */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-6 text-foreground">
              Submit a suggestion
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Food name *
                </label>
                <input
                  value={food}
                  onChange={e => setFood(e.target.value)}
                  placeholder="e.g. Saffron, Oysters, Kimchi…"
                  required
                  maxLength={80}
                  className="w-full bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Why is it interesting? <span className="normal-case">(optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Tell us what makes this food fascinating…"
                  maxLength={200}
                  rows={3}
                  className="w-full bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {reason.length}/200
                </p>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Your email <span className="normal-case">(optional — we'll notify you when published)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {submitResult === "success" && (
                <div className="p-3 rounded-sm text-sm" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#86efac" }}>
                  ✓ Submitted! Your suggestion is under review. We'll notify you when it's published.
                </div>
              )}
              {submitResult === "rejected" && (
                <div className="p-3 rounded-sm text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  That doesn't seem to be a food — try again!
                </div>
              )}
              {submitResult === "error" && (
                <div className="p-3 rounded-sm text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={!food.trim() || submitting}
                className="w-full py-3 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {submitting ? "Checking…" : "Submit Suggestion"}
              </button>
            </form>
          </div>

          {/* Coming Soon / voting list */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-6 text-foreground">
              Coming Soon 📋
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Vote for the food histories you want to read next. The most-voted suggestion each week gets written first.
            </p>
            <div className="space-y-3">
              {approved.map(sub => {
                const hasVoted = sub.votedIPs.includes(sessionId);
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-4 p-4 rounded-sm"
                    style={{
                      background: "hsl(24 15% 8%)",
                      border: "1px solid rgba(212,168,83,0.12)",
                    }}
                  >
                    <button
                      onClick={() => handleVote(sub.id)}
                      disabled={hasVoted}
                      className="flex flex-col items-center gap-0.5 min-w-[40px] transition-all hover:scale-110 disabled:opacity-50"
                      title={hasVoted ? "Already voted" : "Upvote"}
                    >
                      <span className="text-lg">{hasVoted ? "👍" : "👍"}</span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "hsl(40 55% 65%)" }}
                      >
                        {sub.votes}
                      </span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{sub.food}</p>
                      {sub.reason && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {sub.reason}
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: "hsl(30 10% 45%)" }}>
                        {sub.votes} {sub.votes === 1 ? "person wants" : "people want"} this story
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
