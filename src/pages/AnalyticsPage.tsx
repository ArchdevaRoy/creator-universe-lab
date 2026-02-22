import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, Lock } from "lucide-react";

const metrics = [
  { label: "Hook Performance", icon: TrendingUp, value: "—" },
  { label: "Topic Resonance", icon: Activity, value: "—" },
  { label: "Engagement Trends", icon: Users, value: "—" },
  { label: "Identity Drift", icon: BarChart3, value: "—" },
];

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Track content performance and identity consistency.</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-5 flex items-center gap-3">
        <Lock className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Analytics tracking is coming in Phase 2. Connect your platforms to start tracking.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="bg-card border border-border rounded-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <m.icon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-display text-sm font-bold text-foreground">{m.label}</h3>
            </div>
            <div className="h-32 border border-dashed border-border rounded-sm flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No data yet</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
