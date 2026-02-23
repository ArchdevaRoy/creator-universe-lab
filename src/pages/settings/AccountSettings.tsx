import { motion } from "framer-motion";
import { Shield, Key, Download, Trash2 } from "lucide-react";

const actions = [
  { icon: Key, label: "Change Password", desc: "Update your account password", destructive: false },
  { icon: Shield, label: "Two-Factor Auth", desc: "Add an extra layer of security", destructive: false },
  { icon: Download, label: "Export Data", desc: "Download all your content and data", destructive: false },
  { icon: Trash2, label: "Delete Account", desc: "Permanently remove your account and data", destructive: true },
];

export default function AccountSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Security, password, and data management.</p>
      </div>

      {/* Email */}
      <div className="bg-card border border-border rounded-sm p-4">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Address</label>
        <p className="text-sm text-foreground mt-1">creator@darc.app</p>
      </div>

      {/* Actions */}
      <div className="space-y-1">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`w-full flex items-center gap-4 bg-card border border-border rounded-sm p-4 hover:border-muted-foreground/30 transition-colors text-left ${
              a.destructive ? "hover:border-destructive/40" : ""
            }`}
          >
            <a.icon className={`w-5 h-5 ${a.destructive ? "text-destructive" : "text-muted-foreground"}`} />
            <div>
              <h3 className={`text-sm font-medium ${a.destructive ? "text-destructive" : "text-foreground"}`}>{a.label}</h3>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
