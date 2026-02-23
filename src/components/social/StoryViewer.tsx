import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Heart, Send, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Story {
  id: string;
  mediaType: "image" | "video";
  caption?: string;
  timeAgo: string;
  views: number;
}

interface StoryUser {
  id: string;
  name: string;
  avatar: string;
  stories: Story[];
}

interface StoryViewerProps {
  users: StoryUser[];
  initialUserIndex: number;
  onClose: () => void;
}

export function StoryViewer({ users, initialUserIndex, onClose }: StoryViewerProps) {
  const [userIdx, setUserIdx] = useState(initialUserIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const user = users[userIdx];
  const story = user?.stories[storyIdx];
  const STORY_DURATION = 5000;

  const goNext = useCallback(() => {
    if (!user) return;
    if (storyIdx < user.stories.length - 1) {
      setStoryIdx((i) => i + 1);
      setProgress(0);
    } else if (userIdx < users.length - 1) {
      setUserIdx((i) => i + 1);
      setStoryIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIdx, userIdx, user, users.length, onClose]);

  const goPrev = () => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1);
      setProgress(0);
    } else if (userIdx > 0) {
      setUserIdx((i) => i - 1);
      setStoryIdx(0);
      setProgress(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + 100 / (STORY_DURATION / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [goNext]);

  if (!user || !story) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center"
      >
        <div className="relative w-full max-w-sm h-[85vh] bg-card rounded-sm overflow-hidden border border-border">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2">
            {user.stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-100"
                  style={{
                    width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-4 left-0 right-0 z-30 flex items-center justify-between px-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-display font-bold text-accent-foreground">
                {user.avatar}
              </div>
              <div>
                <span className="text-xs font-medium text-foreground">{user.name}</span>
                <span className="block text-[10px] text-muted-foreground">{story.timeAgo}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-sm hover:bg-accent transition-colors">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Story content */}
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mx-auto">
                <span className="text-3xl font-display font-bold text-muted-foreground/30">
                  {user.avatar}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">
                {story.mediaType === "video" ? "Video Story" : "Image Story"}
              </p>
            </div>
          </div>

          {/* Caption */}
          {story.caption && (
            <div className="absolute bottom-16 left-0 right-0 z-30 px-4">
              <p className="text-sm text-foreground bg-background/60 backdrop-blur-sm px-3 py-2 rounded-sm">
                {story.caption}
              </p>
            </div>
          )}

          {/* Navigation areas */}
          <button onClick={goPrev} className="absolute left-0 top-16 bottom-16 w-1/3 z-20" />
          <button onClick={goNext} className="absolute right-0 top-16 bottom-16 w-1/3 z-20" />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center gap-2 p-3 bg-gradient-to-t from-background/80 to-transparent pt-8">
            <input
              type="text"
              placeholder="Reply to story..."
              className="flex-1 bg-muted/50 border border-border rounded-sm px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
            />
            <button className="p-2 rounded-sm hover:bg-accent transition-colors">
              <Heart className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-sm hover:bg-accent transition-colors">
              <Send className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Views count */}
          <div className="absolute bottom-14 right-4 z-30 flex items-center gap-1 text-[10px] text-muted-foreground">
            <Eye className="w-3 h-3" />
            {story.views}
          </div>
        </div>

        {/* Side navigation */}
        {userIdx > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        {userIdx < users.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
