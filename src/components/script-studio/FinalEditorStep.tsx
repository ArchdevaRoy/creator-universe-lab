import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, ZoomIn, ZoomOut, Layers, Download, FileJson, FileVideo,
  Settings2, Sliders, Clock, Sparkles, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

interface Scene {
  id: number;
  title: string;
  duration: string;
  caption: string;
}

interface FinalEditorStepProps {
  scenes: Scene[];
}

export default function FinalEditorStep({ scenes }: FinalEditorStepProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration] = useState(45);
  const [volume, setVolume] = useState([75]);
  const [speed, setSpeed] = useState("1x");
  const [isMuted, setIsMuted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [effectsTab, setEffectsTab] = useState("transitions");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const tracks = [
    { id: "video", label: "Video", color: "bg-foreground/60", segments: scenes.map((s, i) => ({ id: s.id, label: s.title, width: `${100 / scenes.length}%` })) },
    { id: "voiceover", label: "Voice", color: "bg-foreground/40", segments: scenes.map((s, i) => ({ id: s.id, label: `VO ${s.id}`, width: `${100 / scenes.length}%` })) },
    { id: "music", label: "Music", color: "bg-foreground/25", segments: [{ id: 0, label: "Background Music", width: "100%" }] },
    { id: "sfx", label: "SFX", color: "bg-foreground/15", segments: scenes.map((s, i) => ({ id: s.id, label: `SFX ${s.id}`, width: `${100 / scenes.length}%` })) },
    { id: "captions", label: "Text", color: "bg-foreground/10", segments: scenes.map((s, i) => ({ id: s.id, label: s.caption?.slice(0, 15) + "...", width: `${100 / scenes.length}%` })) },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-muted-foreground" />
          <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
            Final Editor
          </label>
          <Badge variant="secondary" className="text-[10px]">{scenes.length} scenes · {formatTime(totalDuration)}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs rounded-sm">
            <Eye className="w-3 h-3" /> Preview
          </Button>
          <Button size="sm" onClick={() => setExportDialogOpen(true)} className="gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90 rounded-sm">
            <Download className="w-3 h-3" /> Export
          </Button>
        </div>
      </div>

      {/* Preview viewport */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="aspect-[9/16] max-h-[320px] mx-auto bg-background flex items-center justify-center relative">
          <div className="text-center space-y-2">
            <Play className="w-10 h-10 text-muted-foreground/30 mx-auto" />
            <p className="text-[11px] text-muted-foreground">Video preview</p>
          </div>
          {/* Overlay captions preview */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-xs text-foreground bg-background/80 px-3 py-1.5 rounded-sm inline-block">
              {scenes[0]?.caption || "Caption preview"}
            </p>
          </div>
        </div>
      </div>

      {/* Transport controls */}
      <div className="bg-card border border-border rounded-sm p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <SkipBack className="w-3 h-3 text-foreground" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-sm bg-foreground flex items-center justify-center hover:bg-foreground/90 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-background" />
              ) : (
                <Play className="w-4 h-4 text-background ml-0.5" />
              )}
            </button>
            <button className="w-7 h-7 rounded-sm border border-border flex items-center justify-center hover:bg-accent transition-colors">
              <SkipForward className="w-3 h-3 text-foreground" />
            </button>
            <span className="text-[11px] font-mono text-muted-foreground ml-2">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed */}
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="bg-background border border-border rounded-sm px-1.5 py-0.5 text-[10px] text-foreground"
              >
                <option>0.25x</option>
                <option>0.5x</option>
                <option>0.75x</option>
                <option>1x</option>
                <option>1.25x</option>
                <option>1.5x</option>
                <option>2x</option>
              </select>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? (
                  <VolumeX className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
              <Slider
                value={isMuted ? [0] : volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-20"
              />
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-accent transition-colors">
                <ZoomOut className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
              <button className="w-6 h-6 rounded-sm border border-border flex items-center justify-center hover:bg-accent transition-colors">
                <ZoomIn className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Playhead / scrubber */}
        <div className="relative">
          {/* Time markers */}
          <div className="flex justify-between mb-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="text-[8px] text-muted-foreground/50 font-mono">
                {formatTime((totalDuration / 9) * i)}
              </span>
            ))}
          </div>
          <Slider
            value={[currentTime]}
            onValueChange={([v]) => setCurrentTime(v)}
            max={totalDuration}
            step={0.1}
            className="mb-2"
          />
        </div>

        {/* Timeline tracks */}
        <div className="space-y-1">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => setActiveTrack(track.id === activeTrack ? null : track.id)}
              className={`flex items-center gap-2 cursor-pointer rounded-sm transition-colors ${
                activeTrack === track.id ? "bg-accent/50" : ""
              }`}
            >
              <span className="text-[9px] font-mono text-muted-foreground w-10 shrink-0 text-right pr-1">
                {track.label}
              </span>
              <div className="flex-1 flex gap-0.5 h-7">
                {track.segments.map((seg) => (
                  <div
                    key={seg.id}
                    className={`${track.color} rounded-sm flex items-center px-2 overflow-hidden transition-colors hover:opacity-80`}
                    style={{ width: seg.width }}
                  >
                    <span className="text-[8px] text-background truncate font-medium">
                      {seg.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Effects & Adjustments */}
      <div className="bg-card border border-border rounded-sm p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
            Effects & Adjustments
          </span>
        </div>

        <Tabs value={effectsTab} onValueChange={setEffectsTab}>
          <TabsList className="bg-background border border-border rounded-sm h-8">
            <TabsTrigger value="transitions" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
              Transitions
            </TabsTrigger>
            <TabsTrigger value="filters" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
              Filters
            </TabsTrigger>
            <TabsTrigger value="text" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
              Text Style
            </TabsTrigger>
            <TabsTrigger value="audio" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
              Audio Mix
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transitions" className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {["Cut", "Fade", "Dissolve", "Slide Left", "Slide Right", "Zoom In", "Zoom Out", "Glitch"].map((t) => (
                <button
                  key={t}
                  className="border border-border rounded-sm p-2 text-[10px] text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground transition-all text-center"
                >
                  {t}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="filters" className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              {["None", "B&W", "Sepia", "High Contrast", "Lo-Fi", "Film Grain", "Cinematic", "Noir"].map((f) => (
                <button
                  key={f}
                  className="border border-border rounded-sm p-2 text-[10px] text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground transition-all text-center"
                >
                  {f}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground">Font Size</span>
                <Slider defaultValue={[16]} max={48} min={8} step={1} />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground">Position</span>
                <select className="w-full bg-background border border-border rounded-sm px-2 py-1 text-[10px] text-foreground">
                  <option>Bottom Center</option>
                  <option>Top Center</option>
                  <option>Center</option>
                  <option>Bottom Left</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground">Font</span>
                <select className="w-full bg-background border border-border rounded-sm px-2 py-1 text-[10px] text-foreground">
                  <option>Space Grotesk</option>
                  <option>Inter</option>
                  <option>Montserrat</option>
                  <option>Playfair Display</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground">Background</span>
                <select className="w-full bg-background border border-border rounded-sm px-2 py-1 text-[10px] text-foreground">
                  <option>Semi-transparent</option>
                  <option>Solid Black</option>
                  <option>None</option>
                  <option>Blur</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-2 space-y-3">
            {[
              { label: "Voiceover", defaultVal: 85 },
              { label: "Background Music", defaultVal: 40 },
              { label: "Sound Effects", defaultVal: 60 },
            ].map((track) => (
              <div key={track.label} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-28 shrink-0">{track.label}</span>
                <Slider defaultValue={[track.defaultVal]} max={100} step={1} className="flex-1" />
                <span className="text-[10px] text-muted-foreground font-mono w-8 text-right">{track.defaultVal}%</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display">Export Project</DialogTitle>
            <DialogDescription>Choose your export format.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <button className="w-full bg-background border border-border rounded-sm p-4 flex items-center gap-3 hover:border-muted-foreground/30 transition-colors text-left">
              <FileJson className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">JSON Project File</h4>
                <p className="text-[11px] text-muted-foreground">Export scenes, scripts, styles, and settings</p>
              </div>
            </button>
            <button className="w-full bg-background border border-border rounded-sm p-4 flex items-center gap-3 hover:border-muted-foreground/30 transition-colors text-left">
              <FileVideo className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-foreground">Video Render (9:16)</h4>
                <p className="text-[11px] text-muted-foreground">Compile visuals, captions, music into vertical video</p>
                <Badge variant="secondary" className="text-[9px] mt-1">Requires Cloud</Badge>
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(false)} className="rounded-sm">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
