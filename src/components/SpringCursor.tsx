import { useEffect, useRef } from "react";

const SPRING_CONFIG = {
  stiffness: 0.17,
  damping: 0.57,
};

export function SpringCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const outlineRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const outlineX = useRef(0);
  const outlineY = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      mouseX.current = event.clientX;
      mouseY.current = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };

    const animate = () => {
      const dx = mouseX.current - outlineX.current;
      const dy = mouseY.current - outlineY.current;
      outlineX.current += dx * SPRING_CONFIG.stiffness;
      outlineY.current += dy * SPRING_CONFIG.stiffness;
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate3d(${outlineX.current}px, ${outlineY.current}px, 0)`;
      }
      requestRef.current = window.requestAnimationFrame(animate);
    };

    document.body.classList.add("custom-spring-cursor");
    window.addEventListener("mousemove", handleMove);
    requestRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) window.cancelAnimationFrame(requestRef.current);
      window.removeEventListener("mousemove", handleMove);
      document.body.classList.remove("custom-spring-cursor");
    };
  }, []);

  return (
    <>
      <div ref={outlineRef} className="spring-cursor-outline" />
      <div ref={dotRef} className="spring-cursor-dot" />
    </>
  );
}
