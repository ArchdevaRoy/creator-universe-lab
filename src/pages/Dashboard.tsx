import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Dna,
  Film,
  PenTool,
  Repeat,
  BarChart3,
  Calendar,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

const statCards = [
  { label: "Blueprint Status", value: "Not Started", icon: Dna, link: "/blueprint" },
  { label: "Active Series", value: "0", icon: Film, link: "/series" },
  { label: "Scripts Analyzed", value: "0", icon: BarChart3, link: "/analyzer" },
  { label: "Calendar Items", value: "0", icon: Calendar, link: "/calendar" },
];

const quickActions = [
  { label: "Build Your Creator DNA", description: "Define your brand, voice, and content pillars", icon: Dna, link: "/blueprint", primary: true },
  { label: "Create a Series", description: "Plan structured content with episode roadmaps", icon: Film, link: "/series" },
  { label: "Analyze a Hook", description: "Score and optimize your content hooks", icon: Target, link: "/analyzer" },
  { label: "Write a Script", description: "Break down scripts into visual scenes", icon: PenTool, link: "/script" },
  { label: "Repurpose Content", description: "Turn one piece into multi-platform gold", icon: Repeat, link: "/repurpose" },
  { label: "Plan Your Calendar", description: "Generate a strategic content calendar", icon: Calendar, link: "/calendar" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-punk">
          Creator Dashboard
        </h1>
        <p className="text-muted-foreground mt-1 font-body text-sm">
          Your AI-powered creative command center.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="group bg-card border border-border rounded-sm p-4 hover:border-muted-foreground/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-4 h-4 text-muted-foreground" />
              <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-display text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </motion.div>

      {/* Glow line */}
      <motion.div variants={item} className="glow-line w-full" />

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className={`group relative overflow-hidden rounded-sm border border-border p-5 transition-all duration-200 hover:border-muted-foreground/30 ${
                action.primary ? "bg-punk-card" : "bg-card"
              }`}
            >
              {action.primary && (
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent pointer-events-none" />
              )}
              <div className="relative">
                <action.icon className={`w-5 h-5 mb-3 ${action.primary ? "text-foreground" : "text-muted-foreground"}`} />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{action.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div variants={item} className="border border-border rounded-sm p-5 bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-display font-bold uppercase tracking-widest text-muted-foreground">
            System Status
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">AI Engine</div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse-subtle" />
              <span className="text-xs text-foreground font-medium">Ready</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Tier</div>
            <div className="text-xs text-foreground font-medium">Free</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Projects</div>
            <div className="text-xs text-foreground font-medium">0 / 1</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
