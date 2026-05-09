import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // food-chronicles1 raw color tokens (used in visual effect classes)
        'gold-bright': '#FFD700',
        'gold-warm':   '#D4A853',
        'gold-deep':   '#8B6914',
        'spice':       '#C24B2A',
        cream:         '#FAF0DC',
        'bg-surface':  '#141009',
        'bg-elevated': '#1C1510',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        herb: {
          DEFAULT: "hsl(var(--herb))",
          foreground: "hsl(var(--herb-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        goldshine: { to: { backgroundPosition: '200% center' } },
        bgshift: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        livepulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(255, 68, 68, 0.6)' },
          '70%':  { boxShadow: '0 0 0 12px rgba(255, 68, 68, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 68, 68, 0)' },
        },
        catpulse: {
          '0%, 100%': { opacity: '0.85' },
          '50%':      { opacity: '1' },
        },
        emojibounce: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.3) rotate(-6deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        'gold-shine':     'goldshine 4s linear infinite',
        'bg-shift':       'bgshift 20s ease infinite',
        'live-pulse':     'livepulse 1.5s ease-in-out infinite',
        'cat-pulse':      'catpulse 2.5s ease-in-out infinite',
        'emoji-bounce':   'emojibounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
