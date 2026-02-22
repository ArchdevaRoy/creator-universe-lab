import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const platforms = ["Instagram", "YouTube", "TikTok", "LinkedIn", "X"];

export default function ContentCalendar() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Instagram", "YouTube"]);
  const [frequency, setFrequency] = useState("3-5x/week");

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // Generate placeholder week
  const weeks = Array.from({ length: 4 }, (_, w) =>
    days.map((day, d) => ({
      day,
      date: w * 7 + d + 1,
      hasContent: Math.random() > 0.5,
    }))
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-punk">Content Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-generated posting schedule across platforms.</p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-foreground text-background px-4 py-2 rounded-sm font-medium hover:bg-foreground/90 transition-colors">
          <Sparkles className="w-4 h-4" /> Generate Calendar
        </button>
      </div>

      {/* Config */}
      <div className="bg-card border border-border rounded-sm p-5 space-y-4">
        <div>
          <label className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2 block">Platforms</label>
          <div className="flex gap-2 flex-wrap">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  selectedPlatforms.includes(p)
                    ? "border-foreground text-foreground bg-accent"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2 block">Frequency</label>
          <div className="flex gap-2">
            {["Daily", "3-5x/week", "2-3x/week", "Weekly"].map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-colors ${
                  frequency === f
                    ? "border-foreground text-foreground bg-accent"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {days.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-display text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, w) => (
          <div key={w} className="grid grid-cols-7 border-b border-border last:border-0">
            {week.map((cell, i) => (
              <div
                key={i}
                className="min-h-[80px] p-2 border-r border-border last:border-0 hover:bg-accent/30 transition-colors"
              >
                <span className="text-xs text-muted-foreground font-mono">{cell.date}</span>
                {cell.hasContent && (
                  <div className="mt-1.5 w-full h-1.5 bg-foreground/20 rounded-full" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
