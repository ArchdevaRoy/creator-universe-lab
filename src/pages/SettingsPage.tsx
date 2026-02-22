import { motion } from "framer-motion";
import { User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {[
        { icon: User, title: "Profile", desc: "Update your name, bio, and avatar" },
        { icon: Bell, title: "Notifications", desc: "Configure email and push notifications" },
        { icon: Shield, title: "Account", desc: "Security, password, and data export" },
        { icon: Palette, title: "Appearance", desc: "Theme and display preferences" },
      ].map((section) => (
        <div
          key={section.title}
          className="bg-card border border-border rounded-sm p-5 flex items-center gap-4 hover:border-muted-foreground/30 transition-colors cursor-pointer"
        >
          <section.icon className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
            <p className="text-xs text-muted-foreground">{section.desc}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
