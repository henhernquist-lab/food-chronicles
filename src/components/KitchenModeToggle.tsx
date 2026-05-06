import { useEffect, useState } from "react";

/**
 * 🕯️ Kitchen Mode Toggle
 * Applies a warm amber candlelight aesthetic to the entire site by toggling
 * the `data-theme="kitchen"` attribute on <body>.
 * Preference is persisted to localStorage.
 */
export function KitchenModeToggle() {
  const [kitchenMode, setKitchenMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("kitchenMode") === "true";
    } catch {
      return false;
    }
  });

  const [showTooltip, setShowTooltip] = useState(false);

  // Apply / remove the data-theme attribute whenever the state changes
  useEffect(() => {
    const body = document.body;
    if (kitchenMode) {
      body.setAttribute("data-theme", "kitchen");
    } else {
      body.removeAttribute("data-theme");
    }
    try {
      localStorage.setItem("kitchenMode", String(kitchenMode));
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [kitchenMode]);

  const toggle = () => {
    const next = !kitchenMode;
    setKitchenMode(next);
    if (next) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={toggle}
        title={kitchenMode ? "Exit Kitchen Mode" : "Enter Kitchen Mode 🕯️"}
        aria-label={kitchenMode ? "Exit Kitchen Mode" : "Enter Kitchen Mode"}
        className={`
          relative px-3 py-1.5 text-xs font-medium rounded-sm border transition-all duration-300
          ${kitchenMode
            ? "bg-amber-900/60 border-amber-600/50 text-amber-200 hover:bg-amber-800/70"
            : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }
        `}
      >
        {kitchenMode ? "🕯️ Kitchen" : "🕯️ Kitchen Mode"}
      </button>

      {/* First-activation tooltip */}
      {showTooltip && (
        <div
          className="absolute top-full mt-2 right-0 z-50 px-3 py-2 text-xs rounded-sm shadow-lg whitespace-nowrap pointer-events-none"
          style={{
            background: "hsl(24 15% 12%)",
            border: "1px solid rgba(212,168,83,0.3)",
            color: "#F5DEB3",
          }}
        >
          🕯️ You're now reading by candlelight
        </div>
      )}
    </div>
  );
}
