import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import { useState } from "react";

export default function ProfileSettings() {
  const [name, setName] = useState("World Builder");
  const [bio, setBio] = useState("Storyteller & creator exploring new worlds.");
  const [username, setUsername] = useState("@worldbuilder");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your public profile information.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="w-20 h-20 rounded-sm bg-accent flex items-center justify-center text-muted-foreground">
            <User className="w-8 h-8" />
          </div>
          <button className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
            <Camera className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Profile Photo</p>
          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1.5 w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="mt-1.5 w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none"
          />
        </div>
      </div>

      <button className="text-sm bg-foreground text-background px-5 py-2.5 rounded-sm font-medium hover:bg-foreground/90 transition-colors">
        Save Changes
      </button>
    </motion.div>
  );
}
