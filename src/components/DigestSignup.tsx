import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DigestSignup — Feature 3 frontend
// Stores subscribers in Supabase via the REST API.
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
// ─────────────────────────────────────────────────────────────────────────────

type SubmitState = "idle" | "loading" | "success" | "error" | "duplicate";

export function DigestSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

    if (!supabaseUrl || !supabaseAnon) {
      // No Supabase configured — just show success for demo purposes
      setState("success");
      return;
    }

    try {
      const token = crypto.randomUUID();
      const res = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnon,
          Authorization: `Bearer ${supabaseAnon}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          is_active: true,
          unsubscribe_token: token,
        }),
      });

      if (res.status === 201) {
        setState("success");
        setEmail("");
      } else if (res.status === 409) {
        setState("duplicate");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <section
      className="my-16 rounded-sm px-8 py-10 text-center"
      style={{
        background: "hsl(24 15% 8%)",
        border: "1px solid rgba(212,168,83,0.2)",
      }}
    >
      {/* Icon */}
      <div className="text-4xl mb-4">📬</div>

      {/* Headline */}
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
        The Weekly Food Chronicle
      </h2>

      {/* Subheadline */}
      <p className="text-sm text-muted-foreground mb-1">
        Every Sunday — 7 mind-bending food history facts, straight to your inbox.
      </p>
      <p className="text-xs text-muted-foreground mb-6 opacity-70">
        No spam. No ads. Just history that makes you say "wait, really?"
      </p>

      {/* Social proof */}
      <div className="flex justify-center gap-6 mb-6">
        {[
          { stat: "12,400+", label: "Subscribers" },
          { stat: "52", label: "Issues Published" },
          { stat: "4.9 ⭐", label: "Avg Rating" },
        ].map(item => (
          <div key={item.label} className="text-center">
            <p className="font-serif font-bold text-lg" style={{ color: "hsl(40 55% 65%)" }}>
              {item.stat}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {state === "success" ? (
        <div
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm text-sm"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#86efac",
          }}
        >
          ✓ You're in! Check your inbox Sunday morning.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-secondary border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!email.trim() || state === "loading"}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40 whitespace-nowrap"
          >
            {state === "loading" ? "Subscribing…" : "Subscribe Free"}
          </button>
        </form>
      )}

      {state === "duplicate" && (
        <p className="text-xs mt-3" style={{ color: "hsl(40 55% 65%)" }}>
          You're already subscribed — see you Sunday!
        </p>
      )}
      {state === "error" && (
        <p className="text-xs mt-3 text-red-400">
          Something went wrong. Please try again.
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-4 opacity-50">
        Unsubscribe anytime. No spam, ever.
      </p>
    </section>
  );
}
