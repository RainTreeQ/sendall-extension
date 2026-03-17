import { useEffect, useMemo, useRef, useState } from "react";
import ShapeGrid from "@/components/ShapeGrid";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function resolveCssColorToRgb(color) {
  if (typeof window === "undefined") return null;
  try {
    const probe = document.createElement("span");
    probe.style.color = color;
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    probe.style.top = "-9999px";
    document.body.appendChild(probe);
    const resolved = window.getComputedStyle(probe).color;
    document.body.removeChild(probe);
    return resolved || null;
  } catch {
    return null;
  }
}

/**
 * Hero background: subtle animated shape grid.
 * - Uses design tokens via CSS variables (no hardcoded colors).
 * - `color-mix` for soft contrast in both themes.
 * - Mouse parallax is gentle and bounded; auto-disables for reduced motion.
 */
export function HeroShapeGrid({ className }) {
  const rootRef = useRef(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [colors, setColors] = useState(() => ({
    border: "rgb(237, 237, 237)",
    hover: "rgb(237, 237, 237)",
  }));

  useEffect(() => {
    // Resolve token colors to rgb for canvas consistency (avoid color-mix/oklch parsing edge cases).
    const nextBorder = resolveCssColorToRgb("color-mix(in oklab, var(--border) 92%, transparent)") || resolveCssColorToRgb("var(--border)");
    const nextHover = resolveCssColorToRgb("color-mix(in oklab, var(--border) 88%, transparent)") || nextBorder;
    if (nextBorder || nextHover) {
      setColors((prev) => ({
        border: nextBorder || prev.border,
        hover: nextHover || prev.hover,
      }));
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const el = rootRef.current;
    if (!el) return undefined;

    let raf = 0;
    const handleMove = (event) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const dx = clamp((x - 0.5) * 10, -6, 6);
        const dy = clamp((y - 0.5) * 10, -6, 6);
        el.style.setProperty("--aib-grid-x", `${dx}px`);
        el.style.setProperty("--aib-grid-y", `${dy}px`);
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handleMove);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0",
        "[--aib-grid-x:0px] [--aib-grid-y:0px]",
        className || "",
      ].join(" ")}
    >
      <div className="absolute inset-0">
        <div
          className={[
            "absolute inset-0",
            // Top-focused mask to keep text readable.
            "[mask-image:radial-gradient(950px_560px_at_50%_8%,black_0%,black_52%,transparent_92%)]",
            "opacity-95",
            "translate-x-[var(--aib-grid-x)] translate-y-[var(--aib-grid-y)]",
            "transition-transform duration-700 ease-out",
          ].join(" ")}
        >
          <ShapeGrid
            speed={prefersReducedMotion ? 0 : 0.2}
            squareSize={75}
            direction="diagonal"
            borderColor={colors.border}
            hoverFillColor={colors.hover}
            shape="square"
            hoverTrailAmount={2}
            listenOnWindow
          />
          {/* Soft top wash to blend into the hero lighting */}
          <div className="absolute inset-0 bg-linear-to-b from-background/35 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

