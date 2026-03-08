import { motion } from "framer-motion";
import { User, Bell, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  { icon: User, title: "Profile", desc: "Update your name, bio, and avatar", path: "/settings/profile" },
  { icon: Bell, title: "Notifications", desc: "Configure email and push notifications", path: "/settings/notifications" },
  { icon: Shield, title: "Account", desc: "Security, password, and data export", path: "/settings/account" },
];

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {sections.map((section) => (
        <Link
          key={section.title}
          to={section.path}
          className="bg-card border border-border rounded-sm p-5 flex items-center gap-4 hover:border-muted-foreground/30 transition-colors cursor-pointer block"
        >
          <section.icon className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-medium text-foreground">{section.title}</h3>
            <p className="text-xs text-muted-foreground">{section.desc}</p>
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
