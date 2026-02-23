import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

type Theme = "dark" | "light" | "system";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("darc-theme") as Theme) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("darc-theme", theme);

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
      root.classList.toggle("light", !prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light", theme === "light");
    }
  }, [theme]);

  const options = [
    { value: "dark" as Theme, label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { value: "light" as Theme, label: "Light", icon: Sun, desc: "Bright and clean" },
    { value: "system" as Theme, label: "System", icon: Monitor, desc: "Match your OS setting" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Appearance</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of D'arc.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center gap-2 p-5 rounded-sm border transition-all ${
                theme === opt.value
                  ? "border-foreground bg-accent"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <opt.icon className={`w-6 h-6 ${theme === opt.value ? "text-foreground" : "text-muted-foreground"}`} />
              <span className={`text-sm font-medium ${theme === opt.value ? "text-foreground" : "text-muted-foreground"}`}>
                {opt.label}
              </span>
              <span className="text-xs text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border border-border rounded-sm p-5 bg-card">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Preview</p>
        <div className="space-y-2">
          <div className="h-3 w-3/4 rounded-sm bg-accent" />
          <div className="h-3 w-1/2 rounded-sm bg-accent" />
          <div className="h-3 w-2/3 rounded-sm bg-accent" />
        </div>
      </div>
    </motion.div>
  );
}
