import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const mockStories = [
  { id: "you", name: "Your Story", avatar: null, hasNew: false, isOwn: true },
  { id: "1", name: "Maya", avatar: "M", hasNew: true, isOwn: false },
  { id: "2", name: "Jordan", avatar: "J", hasNew: true, isOwn: false },
  { id: "3", name: "Alex", avatar: "A", hasNew: true, isOwn: false },
  { id: "4", name: "Priya", avatar: "P", hasNew: false, isOwn: false },
  { id: "5", name: "Sam", avatar: "S", hasNew: true, isOwn: false },
  { id: "6", name: "Luna", avatar: "L", hasNew: false, isOwn: false },
  { id: "7", name: "Kai", avatar: "K", hasNew: true, isOwn: false },
];

export function StoriesBar() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {mockStories.map((story) => {
        const isNew = story.hasNew && !viewed.has(story.id);
        return (
          <button
            key={story.id}
            onClick={() => setViewed((prev) => new Set(prev).add(story.id))}
            className="flex flex-col items-center gap-1.5 shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-display font-bold transition-all ${
                story.isOwn
                  ? "border-2 border-dashed border-muted-foreground/40 text-muted-foreground"
                  : isNew
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {story.isOwn ? <Plus className="w-5 h-5" /> : story.avatar}
            </div>
            <span className="text-[10px] text-muted-foreground truncate w-14 text-center">
              {story.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
