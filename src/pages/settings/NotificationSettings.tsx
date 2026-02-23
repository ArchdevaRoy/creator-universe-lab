import { motion } from "framer-motion";
import { useState } from "react";

const notifications = [
  { id: "likes", label: "Likes", desc: "When someone likes your content" },
  { id: "follows", label: "New Followers", desc: "When someone follows you" },
  { id: "reposts", label: "Reposts", desc: "When your content is reposted" },
  { id: "comments", label: "Comments", desc: "When someone comments on your post" },
  { id: "mentions", label: "Mentions", desc: "When you're mentioned in a post" },
  { id: "stories", label: "Story Shares", desc: "When your content is shared as a story" },
];

export default function NotificationSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    likes: true, follows: true, reposts: true, comments: true, mentions: false, stories: true,
  });

  const toggle = (id: string) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose what you want to be notified about.</p>
      </div>

      <div className="space-y-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between bg-card border border-border rounded-sm p-4 hover:border-muted-foreground/30 transition-colors"
          >
            <div>
              <h3 className="text-sm font-medium text-foreground">{n.label}</h3>
              <p className="text-xs text-muted-foreground">{n.desc}</p>
            </div>
            <button
              onClick={() => toggle(n.id)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                enabled[n.id] ? "bg-foreground" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform ${
                  enabled[n.id] ? "translate-x-5 bg-background" : "translate-x-0.5 bg-muted-foreground"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
