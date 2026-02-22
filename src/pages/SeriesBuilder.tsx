import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Film, Play, Lock, ChevronRight } from "lucide-react";

interface Series {
  id: string;
  name: string;
  theme: string;
  episodes: number;
  status: "draft" | "active" | "complete";
}

const mockSeries: Series[] = [];

export default function SeriesBuilder() {
  const [series, setSeries] = useState<Series[]>(mockSeries);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", theme: "", episodes: 5 });

  const handleCreate = () => {
    if (!form.name || !form.theme) return;
    setSeries([
      ...series,
      {
        id: crypto.randomUUID(),
        name: form.name,
        theme: form.theme,
        episodes: form.episodes,
        status: "draft",
      },
    ]);
    setForm({ name: "", theme: "", episodes: 5 });
    setShowCreate(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-punk">Series Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Create structured content seasons with episode roadmaps.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 text-sm bg-foreground text-background px-4 py-2 rounded-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Series
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-card border border-border rounded-sm p-5 space-y-4"
        >
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Series name"
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground"
          />
          <input
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            placeholder="Theme or topic"
            className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground"
          />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Episodes: {form.episodes}</label>
            <input
              type="range"
              min={3}
              max={20}
              value={form.episodes}
              onChange={(e) => setForm({ ...form, episodes: Number(e.target.value) })}
              className="w-full accent-foreground"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="text-sm bg-foreground text-background px-4 py-2 rounded-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Create Series
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="text-sm text-muted-foreground px-4 py-2 rounded-sm hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Series list */}
      {series.length === 0 && !showCreate ? (
        <div className="border border-dashed border-border rounded-sm p-12 flex flex-col items-center justify-center text-center">
          <Film className="w-8 h-8 text-muted-foreground mb-3" />
          <h3 className="font-display text-sm font-bold text-foreground mb-1">No series yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Create your first content series to get AI-generated episode roadmaps, hooks, and cliffhangers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {series.map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border rounded-sm p-5 hover:border-muted-foreground/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold text-foreground">{s.name}</h3>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{s.theme}</p>

              {/* Episode board */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: s.episodes }, (_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-20 h-24 bg-background border border-border rounded-sm flex flex-col items-center justify-center gap-1 hover:border-muted-foreground/30 transition-colors"
                  >
                    <Play className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">EP {i + 1}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                <span>Generate episode plan with AI</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
