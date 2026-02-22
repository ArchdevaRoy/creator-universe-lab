import { motion } from "framer-motion";
import { PenTool, Film, Music, Mic, Type, ImageIcon } from "lucide-react";

export default function ScriptStudio() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Script Studio</h1>
        <p className="text-sm text-muted-foreground mt-1">Write scripts and generate scene breakdowns with AI.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Script input */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Your Script</label>
          <textarea
            rows={16}
            placeholder="Write or paste your script here..."
            className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none font-body"
          />
          <button className="flex items-center gap-2 text-sm bg-foreground text-background px-5 py-2.5 rounded-sm font-medium hover:bg-foreground/90 transition-colors">
            <Film className="w-4 h-4" /> Generate Scene Breakdown
          </button>
        </div>

        {/* Scene breakdown */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Scene Breakdown</label>
          <div className="space-y-2">
            {[
              { icon: ImageIcon, label: "Visual", desc: "AI-generated scene visuals" },
              { icon: Type, label: "Captions", desc: "Auto-generated captions" },
              { icon: Music, label: "Music", desc: "Background music suggestions" },
              { icon: Mic, label: "Voiceover", desc: "Voice generation option" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-sm p-4 flex items-center gap-3">
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-border rounded-sm p-8 flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center">
              Connect AI to generate scene breakdowns<br />from your script.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
