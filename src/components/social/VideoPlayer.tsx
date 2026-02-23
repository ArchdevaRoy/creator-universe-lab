import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  aspectRatio?: "9/16" | "16/9" | "1/1";
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  aspectRatio = "9/16",
  autoPlay = false,
  onEnded,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = ([v]: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = v;
      setCurrentTime(v);
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => clearTimeout(controlsTimer.current);
  }, []);

  // Demo mode when no src
  const isDemo = !src;

  return (
    <div
      className={`relative bg-background overflow-hidden rounded-sm group ${className}`}
      style={{ aspectRatio }}
      onMouseMove={showControlsTemporarily}
      onTouchStart={showControlsTemporarily}
    >
      {isDemo ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mx-auto">
              <Play className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">
              Video Preview
            </p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={isMuted}
          autoPlay={autoPlay}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onEnded={onEnded}
        />
      )}

      {/* Play/Pause overlay */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <motion.div
          initial={false}
          animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
          className="w-14 h-14 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Play className="w-6 h-6 text-foreground fill-foreground ml-0.5" />
        </motion.div>
      </button>

      {/* Bottom controls */}
      <motion.div
        initial={false}
        animate={{ opacity: showControls ? 1 : 0 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-3 pt-8 z-20"
      >
        <Slider
          value={[currentTime]}
          onValueChange={handleSeek}
          max={duration || 100}
          step={0.1}
          className="mb-2"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="p-1">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-foreground" />
              ) : (
                <Play className="w-4 h-4 text-foreground" />
              )}
            </button>
            <span className="text-[10px] font-mono text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className="p-1">
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            <button className="p-1">
              <Maximize className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
