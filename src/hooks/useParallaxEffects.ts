import { useEffect } from "react";

/**
 * 📜 Parallax Scroll Effects — Feature 11
 *
 * Initialises GSAP ScrollTrigger animations on article pages.
 * All effects are disabled on screens narrower than 768 px to prevent
 * motion sickness and performance issues on mobile.
 *
 * Animations applied:
 *  - Hero video / image: 50 % scroll speed parallax
 *  - Fast Facts card: slide-up + fade-in entrance
 *  - World Map section: float-up entrance
 *  - Timeline items: staggered slide-in from left
 *  - Spline / 3D container: scale-up entrance
 *  - Article body paragraphs: gentle fade-in
 *  - Reading progress bar: fills as user reads (driven by scroll)
 */
export function useParallaxEffects(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    // Disable on mobile
    if (window.innerWidth <= 768) return;

    let ctx: { revert: () => void } | null = null;

    // Dynamically import GSAP to keep the initial bundle lean
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // ── Hero parallax ──────────────────────────────────────────────
          const heroVideo = document.querySelector<HTMLElement>(".hero-video, .hero-container img");
          const heroContainer = document.querySelector<HTMLElement>(".hero-container");
          if (heroVideo && heroContainer) {
            gsap.to(heroVideo, {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: heroContainer,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          // ── Fast Facts card entrance ───────────────────────────────────
          const fastFacts = document.querySelector<HTMLElement>(".fast-facts-card");
          if (fastFacts) {
            gsap.from(fastFacts, {
              y: 60,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: fastFacts,
                start: "top 80%",
              },
            });
          }

          // ── World Map section float-up ─────────────────────────────────
          const worldMap = document.querySelector<HTMLElement>(".world-map-section");
          if (worldMap) {
            gsap.from(worldMap, {
              y: 40,
              opacity: 0,
              duration: 1.0,
              scrollTrigger: {
                trigger: worldMap,
                start: "top 75%",
              },
            });
          }

          // ── Timeline items staggered slide-in ─────────────────────────
          const timelineSection = document.querySelector<HTMLElement>(".timeline-section");
          const timelineItems = document.querySelectorAll<HTMLElement>(".timeline-item");
          if (timelineSection && timelineItems.length) {
            gsap.from(timelineItems, {
              x: -50,
              opacity: 0,
              duration: 0.5,
              stagger: 0.1,
              scrollTrigger: {
                trigger: timelineSection,
                start: "top 70%",
              },
            });
          }

          // ── Spline / 3D container scale-up ────────────────────────────
          const spline = document.querySelector<HTMLElement>(".spline-container");
          if (spline) {
            gsap.from(spline, {
              scale: 0.95,
              opacity: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: spline,
                start: "top 80%",
              },
            });
          }

          // ── Article body paragraphs gentle fade-in ────────────────────
          const articleEl = document.querySelector<HTMLElement>("article");
          const paragraphs = articleEl
            ? articleEl.querySelectorAll<HTMLElement>("p")
            : [];
          if (paragraphs.length) {
            gsap.from(paragraphs, {
              opacity: 0,
              y: 20,
              duration: 0.6,
              stagger: 0.05,
              scrollTrigger: {
                trigger: articleEl,
                start: "top 60%",
              },
            });
          }

          // ── Reading progress bar ───────────────────────────────────────
          const progressBar = document.querySelector<HTMLElement>(".reading-progress");
          if (progressBar) {
            gsap.to(progressBar, {
              width: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            });
          }
        });
      });
    });

    return () => {
      ctx?.revert();
    };
  }, [enabled]);
}
