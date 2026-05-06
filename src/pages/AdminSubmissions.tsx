import { useState } from "react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Simple password gate — change this to a real auth system in production
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "foodchronicle2024";

interface Submission {
  id: string;
  food: string;
  reason: string;
  email: string;
  votes: number;
  status: "approved" | "pending" | "rejected";
  votedIPs: string[];
}

function loadSubmissions(): Submission[] {
  try {
    const stored = localStorage.getItem("fc_submissions");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveSubmissions(subs: Submission[]): void {
  try {
    localStorage.setItem("fc_submissions", JSON.stringify(subs));
  } catch { /* ignore */ }
}

export default function AdminSubmissions() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setSubmissions(loadSubmissions());
    } else {
      setAuthError(true);
    }
  };

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    const updated = submissions.map(s =>
      s.id === id ? { ...s, status } : s
    );
    setSubmissions(updated);
    saveSubmissions(updated);
  };

  const pending = submissions.filter(s => s.status === "pending");
  const approved = submissions.filter(s => s.status === "approved");
  const rejected = submissions.filter(s => s.status === "rejected");

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm p-8 rounded-sm"
          style={{
            background: "hsl(24 15% 8%)",
            border: "1px solid rgba(212,168,83,0.2)",
          }}
        >
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Submission moderation panel
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthError(false); }}
              placeholder="Password"
              className="w-full bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {authError && (
              <p className="text-xs text-red-400">Incorrect password.</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
            >
              Enter
            </button>
          </form>
          <Link to="/" className="block mt-4 text-xs text-muted-foreground hover:text-primary transition-colors text-center">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  const SubmissionRow = ({ sub, showActions }: { sub: Submission; showActions: boolean }) => (
    <div
      className="p-4 rounded-sm"
      style={{
        background: "hsl(24 15% 8%)",
        border: "1px solid rgba(212,168,83,0.12)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{sub.food}</p>
          {sub.reason && (
            <p className="text-xs text-muted-foreground mt-0.5">{sub.reason}</p>
          )}
          {sub.email && (
            <p className="text-xs mt-1" style={{ color: "hsl(40 55% 55%)" }}>
              📧 {sub.email}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {sub.votes} votes · Status: <span className={
              sub.status === "approved" ? "text-green-400" :
              sub.status === "rejected" ? "text-red-400" :
              "text-yellow-400"
            }>{sub.status}</span>
          </p>
        </div>
        {showActions && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => updateStatus(sub.id, "approved")}
              className="px-3 py-1.5 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.2)" }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => updateStatus(sub.id, "rejected")}
              className="px-3 py-1.5 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 py-6">
        <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Submission Moderation
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {pending.length} pending · {approved.length} approved · {rejected.length} rejected
            </p>
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-10 space-y-12">
        {/* Pending */}
        <section>
          <h2 className="font-serif text-lg font-bold mb-4 text-foreground">
            ⏳ Pending Review ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending submissions.</p>
          ) : (
            <div className="space-y-3">
              {pending.map(sub => (
                <SubmissionRow key={sub.id} sub={sub} showActions />
              ))}
            </div>
          )}
        </section>

        {/* Approved */}
        <section>
          <h2 className="font-serif text-lg font-bold mb-4 text-foreground">
            ✓ Approved ({approved.length})
          </h2>
          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">No approved submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {approved.map(sub => (
                <SubmissionRow key={sub.id} sub={sub} showActions={false} />
              ))}
            </div>
          )}
        </section>

        {/* Rejected */}
        <section>
          <h2 className="font-serif text-lg font-bold mb-4 text-foreground">
            ✕ Rejected ({rejected.length})
          </h2>
          {rejected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rejected submissions.</p>
          ) : (
            <div className="space-y-3">
              {rejected.map(sub => (
                <SubmissionRow key={sub.id} sub={sub} showActions={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
