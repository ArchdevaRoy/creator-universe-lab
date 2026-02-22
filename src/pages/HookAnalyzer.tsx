import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, Eye, Heart, Brain } from "lucide-react";

interface ScoreResult {
  hook: number;
  clarity: number;
  curiosity: number;
  emotion: number;
  dropOff: number;
}

const mockScore: ScoreResult = {
  hook: 78,
  clarity: 85,
  curiosity: 62,
  emotion: 71,
  dropOff: 34,
};

function ScoreMeter({ label, score, icon: Icon, delay = 0 }: { label: string; score: number; icon: any; delay?: number }) {
  const color = score >= 75 ? "bg-foreground" : score >= 50 ? "bg-muted-foreground" : "bg-destructive";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className="font-mono text-xs text-foreground font-bold">{score}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function HookAnalyzer() {
  const [text, setText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (text.trim().length < 10) return;
    setAnalyzed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Hook & Retention Analyzer</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste a script, caption, or idea. AI scores its effectiveness.</p>
      </div>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setAnalyzed(false); }}
          rows={6}
          placeholder="Paste your script, caption, or content idea here..."
          className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none font-body"
        />
        <button
          onClick={handleAnalyze}
          disabled={text.trim().length < 10}
          className="flex items-center gap-2 text-sm bg-foreground text-background px-5 py-2.5 rounded-sm font-medium hover:bg-foreground/90 disabled:opacity-30 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Analyze Hook
        </button>
      </div>

      {analyzed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glow-line w-full" />

          {/* Overall score */}
          <div className="bg-card border border-border rounded-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-sm bg-accent flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-foreground">
                  {Math.round((mockScore.hook + mockScore.clarity + mockScore.curiosity + mockScore.emotion) / 4)}
                </span>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Overall Score</h3>
                <p className="text-xs text-muted-foreground">Composite of all metrics</p>
              </div>
            </div>

            <div className="space-y-4">
              <ScoreMeter label="Hook Strength" score={mockScore.hook} icon={TrendingUp} delay={0} />
              <ScoreMeter label="Clarity" score={mockScore.clarity} icon={Eye} delay={0.1} />
              <ScoreMeter label="Curiosity Gap" score={mockScore.curiosity} icon={Brain} delay={0.2} />
              <ScoreMeter label="Emotional Trigger" score={mockScore.emotion} icon={Heart} delay={0.3} />
            </div>
          </div>

          {/* Drop-off risk */}
          <div className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h3 className="font-display text-sm font-bold text-foreground">Drop-off Risk</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-destructive rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${mockScore.dropOff}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
              <span className="font-mono text-xs text-foreground font-bold">{mockScore.dropOff}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Estimated viewer drop-off within first 3 seconds.</p>
          </div>

          {/* Suggestions placeholder */}
          <div className="bg-card border border-border rounded-sm p-5">
            <h3 className="font-display text-sm font-bold text-foreground mb-3">Rewrite Suggestions</h3>
            <div className="space-y-2">
              {["Stronger opening hook", "Add a pattern interrupt", "Increase specificity"].map((s) => (
                <div key={s} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                  <Sparkles className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{s}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Connect AI</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
