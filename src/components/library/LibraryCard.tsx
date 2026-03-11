import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music, Video, Flame, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useKarmaTracker } from "@/hooks/useKarmaTracker";
import { supabase } from "@/integrations/supabase/client";

interface LibraryItem {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  content_type: "audio" | "video";
  genre: string;
  category: string;
  file_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number;
  karma_total: number;
  play_count: number;
  created_at: string;
  profiles?: { display_name: string | null; avatar_url: string | null } | null;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function LibraryCard({ item }: { item: LibraryItem }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const { checkMilestone } = useKarmaTracker(item.id, item.duration_seconds);
  const hasTrackedPlay = useRef(false);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (playing) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
      if (!hasTrackedPlay.current) {
        hasTrackedPlay.current = true;
        supabase.rpc("increment_play_count", { p_item_id: item.id });
      }
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!mediaRef.current) return;
    setCurrentTime(mediaRef.current.currentTime);
    checkMilestone(mediaRef.current.currentTime);
  };

  const handleSeek = (val: number[]) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = val[0];
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        mediaRef.current.pause();
      }
    };
  }, []);

  const isAudio = item.content_type === "audio";
  const creatorName = item.profiles?.display_name || "Creator";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/30 transition-all"
    >
      {/* Thumbnail / video area */}
      <div className="relative aspect-video bg-secondary/50 flex items-center justify-center overflow-hidden">
        {item.content_type === "video" && item.file_url ? (
          <video
            ref={(el) => { mediaRef.current = el; }}
            src={item.file_url}
            poster={item.thumbnail_url || undefined}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setPlaying(false)}
            playsInline
          />
        ) : (
          <>
            {item.thumbnail_url ? (
              <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Music className="w-8 h-8" />
                <span className="text-[10px]">Audio</span>
              </div>
            )}
            {isAudio && item.file_url && (
              <audio
                ref={(el) => { mediaRef.current = el; }}
                src={item.file_url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setPlaying(false)}
              />
            )}
          </>
        )}

        {/* Play overlay */}
        {item.file_url && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {playing ? (
              <Pause className="w-10 h-10 text-primary-foreground drop-shadow-lg" />
            ) : (
              <Play className="w-10 h-10 text-primary-foreground drop-shadow-lg" />
            )}
          </button>
        )}

        {/* Type badge */}
        <Badge className="absolute top-2 left-2 text-[10px] gap-1 bg-background/70 text-foreground border-none">
          {isAudio ? <Music className="w-2.5 h-2.5" /> : <Video className="w-2.5 h-2.5" />}
          {item.content_type}
        </Badge>

        {/* Duration */}
        {item.duration_seconds > 0 && (
          <span className="absolute bottom-2 right-2 text-[10px] bg-background/70 text-foreground px-1.5 py-0.5 rounded-sm flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {formatDuration(item.duration_seconds)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-display text-sm font-semibold truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{creatorName}</p>

        {/* Progress bar when playing */}
        {playing && item.duration_seconds > 0 && (
          <Slider
            value={[currentTime]}
            max={item.duration_seconds}
            step={1}
            onValueChange={handleSeek}
            className="h-1"
          />
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 capitalize">
              {item.genre.replace(/-/g, " ")}
            </span>
            <span className="flex items-center gap-1 capitalize">
              {item.category.replace(/-/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" /> {item.play_count}
            </span>
            <span className="flex items-center gap-0.5 text-primary">
              <Flame className="w-3 h-3" /> {item.karma_total}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
