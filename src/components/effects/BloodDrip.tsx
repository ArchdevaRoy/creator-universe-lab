import { useMemo } from "react";

interface Drip {
  left: string;
  height: string;
  delay: string;
  opacity: number;
}

export function BloodDrip() {
  const drips = useMemo<Drip[]>(() => {
    const positions = [3, 12, 24, 38, 55, 67, 78, 91];
    return positions.map((pos, i) => ({
      left: `${pos}%`,
      height: `${20 + (i % 3) * 18}px`,
      delay: `${i * 0.7}s`,
      opacity: 0.25 + (i % 3) * 0.1,
    }));
  }, []);

  return (
    <>
      {/* Top blood drips */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-20 overflow-hidden">
        {drips.map((drip, i) => (
          <div
            key={i}
            className="absolute top-0 rounded-b-full animate-[bloodDrip_4s_ease-in-out_infinite]"
            style={{
              left: drip.left,
              width: "2px",
              height: drip.height,
              background: `linear-gradient(180deg, hsl(0 80% 35% / ${drip.opacity}), hsl(0 80% 25% / 0))`,
              animationDelay: drip.delay,
            }}
          />
        ))}
        {/* Top edge crimson glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent 5%, hsl(0 70% 30% / 0.4) 30%, hsl(0 80% 35% / 0.6) 50%, hsl(0 70% 30% / 0.4) 70%, transparent 95%)",
          }}
        />
      </div>

      {/* Right edge glow */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[1px] pointer-events-none z-20"
        style={{
          background: "linear-gradient(180deg, hsl(0 80% 35% / 0.3) 0%, hsl(0 70% 28% / 0.15) 40%, transparent 70%)",
        }}
      />
    </>
  );
}
