import { useParallax } from "@/hooks/useParallax";

interface ParallaxBackgroundProps {
  variant?: "hero" | "page" | "subtle";
}

export function ParallaxBackground({ variant = "page" }: ParallaxBackgroundProps) {
  const { scrollY } = useParallax();

  if (variant === "hero") {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Large primary orb - moves slow */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        {/* Accent orb - moves medium */}
        <div
          className="absolute top-1/4 -right-20 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        />
        {/* Secondary orb - moves fast */}
        <div
          className="absolute top-2/3 left-1/4 w-[350px] h-[350px] rounded-full bg-secondary/10 blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        {/* Small floating accent */}
        <div
          className="absolute top-1/2 right-1/3 w-[200px] h-[200px] rounded-full bg-primary/3 blur-2xl"
          style={{ transform: `translateY(${scrollY * -0.2}px) translateX(${scrollY * 0.05}px)` }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-20 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute top-1/2 -left-16 w-[250px] h-[250px] rounded-full bg-accent/4 blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
      </div>
    );
  }

  // Default "page" variant
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top-left orb */}
      <div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/5 blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.12}px)` }}
      />
      {/* Right accent orb */}
      <div
        className="absolute top-1/3 -right-16 w-[350px] h-[350px] rounded-full bg-accent/5 blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      {/* Bottom secondary orb */}
      <div
        className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-secondary/8 blur-3xl"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.012] dark:opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          transform: `translateY(${scrollY * 0.03}px)`,
        }}
      />
    </div>
  );
}
