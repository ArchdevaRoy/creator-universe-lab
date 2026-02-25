import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Music, Mic, Type, ImageIcon, Upload, Sparkles, Download,
  Play, Pause, Volume2, Palette, Eye, Layers, Video, Wand2,
  ChevronRight, ChevronLeft, X, Plus, Grid3X3, Camera, Check, Loader2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import StyleVibeStep, { type SelectedStyle } from "@/components/script-studio/StyleVibeStep";
import FinalEditorStep from "@/components/script-studio/FinalEditorStep";
import { generateImage, generateVideo, generateTTS, generateSFX, generateMusic } from "@/lib/api";

// --- Types ---
interface Scene {
  id: number;
  title: string;
  description: string;
  duration: string;
  visual: string;
  caption: string;
  music: string;
  sfx: string;
  voiceover: string;
}

const MOCK_SCENES: Scene[] = [
  { id: 1, title: "Opening Hook", description: "Close-up shot, dramatic reveal of the subject", duration: "0:00–0:03", visual: "Extreme close-up, shallow DOF", caption: "\"You've been doing this wrong...\"", music: "Low ambient drone", sfx: "Subtle bass hit", voiceover: "Narrator introduces tension" },
  { id: 2, title: "Context Setup", description: "Wide establishing shot, context visual", duration: "0:03–0:08", visual: "Wide shot with text overlay", caption: "\"Here's what nobody tells you about...\"", music: "Building tension", sfx: "Whoosh transition", voiceover: "Set the stakes" },
  { id: 3, title: "Core Message", description: "Direct-to-camera delivery of key insight", duration: "0:08–0:20", visual: "Medium shot, clean background", caption: "Key insight displayed", music: "Minimal, focused", sfx: "Subtle emphasis sounds", voiceover: "Deliver the value" },
  { id: 4, title: "Proof / Example", description: "B-roll or screen recording showing evidence", duration: "0:20–0:35", visual: "Screen capture or B-roll montage", caption: "Step-by-step walkthrough", music: "Upbeat, energetic", sfx: "Click sounds, notifications", voiceover: "Walk through the proof" },
  { id: 5, title: "CTA & Close", description: "Strong call-to-action with visual hook", duration: "0:35–0:45", visual: "Return to direct-to-camera + CTA card", caption: "\"Follow for part 2...\"", music: "Resolve, satisfying end", sfx: "Subscribe bell sound", voiceover: "Drive action" },
];

const STEPS = [
  { id: 1, label: "Script & Scenes" },
  { id: 2, label: "Style & Vibe" },
  { id: 3, label: "AI Studio" },
  { id: 4, label: "Editor" },
];

export default function ScriptStudio() {
  const [currentStep, setCurrentStep] = useState(1);
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [studioTab, setStudioTab] = useState("image");

  // Style & Vibe state
  const [selectedStyles, setSelectedStyles] = useState<SelectedStyle[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // AI Studio state
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [voiceoverText, setVoiceoverText] = useState("");
  const [musicPrompt, setMusicPrompt] = useState("");
  const [sfxPrompt, setSfxPrompt] = useState("");
  const [voiceId, setVoiceId] = useState("JBFqnCBsd6RMkjVDRZzb");

  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [generatingVoiceover, setGeneratingVoiceover] = useState(false);
  const [generatingMusic, setGeneratingMusic] = useState(false);
  const [generatingSfx, setGeneratingSfx] = useState(false);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedVideoData, setGeneratedVideoData] = useState<any>(null);
  const [generatedVoiceoverUrl, setGeneratedVoiceoverUrl] = useState<string | null>(null);
  const [generatedMusicUrl, setGeneratedMusicUrl] = useState<string | null>(null);
  const [generatedSfxUrl, setGeneratedSfxUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setGeneratingImage(true);
    try {
      const url = await generateImage(imagePrompt);
      setGeneratedImageUrl(url);
      toast.success("Image generated!");
    } catch (e: any) {
      toast.error(e.message || "Image generation failed");
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setGeneratingVideo(true);
    try {
      const data = await generateVideo({ provider: "pixverse", prompt: videoPrompt });
      setGeneratedVideoData(data);
      toast.success("Video generation started!");
    } catch (e: any) {
      toast.error(e.message || "Video generation failed");
    } finally {
      setGeneratingVideo(false);
    }
  };

  const handleGenerateVoiceover = async () => {
    if (!voiceoverText.trim()) return;
    setGeneratingVoiceover(true);
    try {
      const url = await generateTTS(voiceoverText, voiceId);
      setGeneratedVoiceoverUrl(url);
      toast.success("Voiceover generated!");
    } catch (e: any) {
      toast.error(e.message || "Voiceover generation failed");
    } finally {
      setGeneratingVoiceover(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setGeneratingMusic(true);
    try {
      const url = await generateMusic(musicPrompt);
      setGeneratedMusicUrl(url);
      toast.success("Music generated!");
    } catch (e: any) {
      toast.error(e.message || "Music generation failed");
    } finally {
      setGeneratingMusic(false);
    }
  };

  const handleGenerateSfx = async () => {
    if (!sfxPrompt.trim()) return;
    setGeneratingSfx(true);
    try {
      const url = await generateSFX(sfxPrompt);
      setGeneratedSfxUrl(url);
      toast.success("SFX generated!");
    } catch (e: any) {
      toast.error(e.message || "SFX generation failed");
    } finally {
      setGeneratingSfx(false);
    }
  };

  const handleGenerateBreakdown = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setScenes(MOCK_SCENES);
          setActiveScene(1);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const selectedScene = scenes.find((s) => s.id === activeScene);
  const canProceedFromStep1 = scenes.length > 0;
  const canProceedFromStep2 = selectedStyles.length > 0 || uploadedImages.length > 0;

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gradient-punk">Script Studio</h1>
        <p className="text-sm text-muted-foreground mt-1">Write → Style → Generate → Edit → Export</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1">
            <button
              onClick={() => {
                if (step.id <= currentStep || (step.id === 2 && canProceedFromStep1) || (step.id === 3 && canProceedFromStep2)) {
                  setCurrentStep(step.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] border transition-all ${
                currentStep === step.id
                  ? "border-foreground/40 bg-foreground/10 text-foreground"
                  : currentStep > step.id
                  ? "border-foreground/20 bg-accent text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              {currentStep > step.id && <Check className="w-2.5 h-2.5" />}
              <span className="font-mono text-[10px] mr-0.5">{step.id}</span>
              {step.label}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30" />}
          </div>
        ))}
      </div>

      <Separator className="bg-border" />

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Script & Scenes */}
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Script Input */}
              <div className="lg:col-span-2 space-y-3">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Your Script</label>
                <textarea
                  rows={20}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder={"Write or paste your script here...\n\nExample:\n[HOOK] Close-up. \"You've been doing this wrong.\"\n[CONTEXT] Wide shot. Set the scene.\n[CORE] Deliver the insight.\n[PROOF] Show the evidence.\n[CTA] \"Follow for part 2.\""}
                  className="w-full bg-card border border-border rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none font-body"
                />
                <Button
                  onClick={handleGenerateBreakdown}
                  disabled={!script.trim() || isGenerating}
                  className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 rounded-sm"
                >
                  {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
                  {isGenerating ? "Generating..." : "Generate Scene Breakdown"}
                </Button>
                {isGenerating && <Progress value={generationProgress} className="h-1" />}
              </div>

              {/* Scene Breakdown */}
              <div className="lg:col-span-3 space-y-3">
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Scene Breakdown {scenes.length > 0 && <Badge variant="secondary" className="ml-2 text-[10px]">{scenes.length} scenes</Badge>}
                </label>
                {scenes.length === 0 ? (
                  <div className="border border-dashed border-border rounded-sm p-12 flex flex-col items-center justify-center gap-3">
                    <Grid3X3 className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground text-center max-w-[240px]">Write a script and generate to see your scene breakdown.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[460px]">
                    <div className="space-y-2 pr-3">
                      {scenes.map((scene) => (
                        <motion.div
                          key={scene.id}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: scene.id * 0.08 }}
                          onClick={() => setActiveScene(scene.id)}
                          className={`border rounded-sm p-4 cursor-pointer transition-all ${
                            activeScene === scene.id ? "border-foreground/30 bg-accent/50" : "border-border bg-card hover:border-muted-foreground/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Scene {scene.id}</span>
                              <h4 className="text-sm font-medium text-foreground">{scene.title}</h4>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">{scene.duration}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{scene.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { icon: ImageIcon, label: "Visual", value: scene.visual },
                              { icon: Type, label: "Caption", value: scene.caption },
                              { icon: Music, label: "Music", value: scene.music },
                              { icon: Volume2, label: "SFX", value: scene.sfx },
                            ].map((item) => (
                              <div key={item.label} className="flex items-start gap-1.5">
                                <item.icon className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-[11px] text-muted-foreground leading-tight">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Style & Vibe */}
        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <StyleVibeStep
              selectedStyles={selectedStyles}
              onStylesChange={setSelectedStyles}
              uploadedImages={uploadedImages}
              onUploadedImagesChange={setUploadedImages}
            />
          </motion.div>
        )}

        {/* STEP 3: AI Generation Studio */}
        {currentStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            {/* Style context banner */}
            {selectedStyles.length > 0 && (
              <div className="bg-card border border-border rounded-sm p-3 flex items-center gap-3">
                <Palette className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <span className="text-[11px] text-muted-foreground">Generating in style:</span>
                  {selectedStyles.map((s) => (
                    <span key={s.keyword} className="text-[10px] px-2 py-0.5 bg-accent rounded-sm text-foreground capitalize">{s.keyword}</span>
                  ))}
                </div>
                <div className="flex gap-1">
                  {selectedStyles.flatMap((s) => s.selectedImages.slice(0, 1)).map((img) => (
                    <img key={img} src={img} alt="" className="w-8 h-10 object-cover rounded-sm border border-border" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-muted-foreground" />
              <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">AI Generation Studio</label>
              {selectedScene && <Badge variant="secondary" className="text-[10px]">Scene {selectedScene.id}: {selectedScene.title}</Badge>}
            </div>

            {/* Scene selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveScene(scene.id)}
                  className={`px-3 py-1.5 rounded-sm text-[11px] border whitespace-nowrap transition-all shrink-0 ${
                    activeScene === scene.id ? "border-foreground/40 bg-foreground/10 text-foreground" : "border-border text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  Scene {scene.id}: {scene.title}
                </button>
              ))}
            </div>

            <Tabs value={studioTab} onValueChange={setStudioTab}>
              <TabsList className="bg-card border border-border rounded-sm h-9">
                <TabsTrigger value="image" className="text-xs gap-1.5 rounded-sm data-[state=active]:bg-accent"><ImageIcon className="w-3 h-3" /> Image</TabsTrigger>
                <TabsTrigger value="video" className="text-xs gap-1.5 rounded-sm data-[state=active]:bg-accent"><Video className="w-3 h-3" /> Video</TabsTrigger>
                <TabsTrigger value="voiceover" className="text-xs gap-1.5 rounded-sm data-[state=active]:bg-accent"><Mic className="w-3 h-3" /> Voiceover</TabsTrigger>
                <TabsTrigger value="music" className="text-xs gap-1.5 rounded-sm data-[state=active]:bg-accent"><Music className="w-3 h-3" /> Music</TabsTrigger>
                <TabsTrigger value="sfx" className="text-xs gap-1.5 rounded-sm data-[state=active]:bg-accent"><Volume2 className="w-3 h-3" /> SFX</TabsTrigger>
              </TabsList>

              {/* Image */}
              <TabsContent value="image" className="mt-3">
                <div className="bg-card border border-border rounded-sm p-4 space-y-3">
                  <textarea rows={3} placeholder="Describe the image for this scene..." value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleGenerateImage} disabled={generatingImage || !imagePrompt.trim()} className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm">
                      {generatingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {generatingImage ? "Generating..." : "Generate Image"}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">Powered by Lovable AI</span>
                  </div>
                  <div className="border border-dashed border-border rounded-sm aspect-video flex items-center justify-center overflow-hidden">
                    {generatedImageUrl ? (
                      <img src={generatedImageUrl} alt="Generated" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center space-y-1">
                        <Camera className="w-6 h-6 text-muted-foreground/30 mx-auto" />
                        <p className="text-[11px] text-muted-foreground">Generated image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Video */}
              <TabsContent value="video" className="mt-3">
                <div className="bg-card border border-border rounded-sm p-4 space-y-3">
                  <textarea rows={3} placeholder="Describe the motion or video clip..." value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleGenerateVideo} disabled={generatingVideo || !videoPrompt.trim()} className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm">
                      {generatingVideo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Video className="w-3 h-3" />}
                      {generatingVideo ? "Generating..." : "Generate Video Clip"}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">5–10s clips · 9:16 · Pixverse</span>
                  </div>
                  <div className="border border-dashed border-border rounded-sm aspect-[9/16] max-h-[300px] flex items-center justify-center">
                    {generatedVideoData ? (
                      <div className="text-center space-y-2 p-4">
                        <Check className="w-6 h-6 text-foreground mx-auto" />
                        <p className="text-[11px] text-muted-foreground">Video generation submitted</p>
                        <pre className="text-[10px] text-muted-foreground bg-background p-2 rounded-sm overflow-auto max-h-32 text-left">{JSON.stringify(generatedVideoData, null, 2)}</pre>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <Play className="w-6 h-6 text-muted-foreground/30 mx-auto" />
                        <p className="text-[11px] text-muted-foreground">Generated clip will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Voiceover */}
              <TabsContent value="voiceover" className="mt-3">
                <div className="bg-card border border-border rounded-sm p-4 space-y-3">
                  <textarea rows={3} placeholder="Enter voiceover text..." value={voiceoverText}
                    onChange={(e) => setVoiceoverText(e.target.value)}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none" />
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={handleGenerateVoiceover} disabled={generatingVoiceover || !voiceoverText.trim()} className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm">
                      {generatingVoiceover ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mic className="w-3 h-3" />}
                      {generatingVoiceover ? "Generating..." : "Generate Voiceover"}
                    </Button>
                    <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)} className="bg-background border border-border rounded-sm px-2 py-1 text-xs text-foreground">
                      <option value="JBFqnCBsd6RMkjVDRZzb">Roger — Deep Male</option>
                      <option value="EXAVITQu4vr4xnSDxMaL">Sarah — Warm Female</option>
                      <option value="IKne3meq5aSn9XLyUdCD">Charlie — Energetic Male</option>
                      <option value="pFZP5JQG7iQjIQuC4Bku">Lily — Soft Female</option>
                    </select>
                  </div>
                  <div className="border border-dashed border-border rounded-sm p-4">
                    {generatedVoiceoverUrl ? (
                      <audio controls src={generatedVoiceoverUrl} className="w-full h-8" />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground"><Play className="w-3 h-3" /></button>
                          <div className="w-48 h-1 bg-border rounded-full"><div className="w-0 h-full bg-foreground rounded-full" /></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">0:00 / 0:00</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Music */}
              <TabsContent value="music" className="mt-3">
                <div className="bg-card border border-border rounded-sm p-4 space-y-3">
                  <textarea rows={2} placeholder="Describe the mood and style of music..." value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleGenerateMusic} disabled={generatingMusic || !musicPrompt.trim()} className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm">
                      {generatingMusic ? <Loader2 className="w-3 h-3 animate-spin" /> : <Music className="w-3 h-3" />}
                      {generatingMusic ? "Generating..." : "Generate Music"}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">ElevenLabs · ~30s clip</span>
                  </div>
                  <div className="border border-dashed border-border rounded-sm p-4">
                    {generatedMusicUrl ? (
                      <audio controls src={generatedMusicUrl} className="w-full h-8" />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground"><Play className="w-3 h-3" /></button>
                          <div className="w-48 h-1 bg-border rounded-full" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">0:00</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* SFX */}
              <TabsContent value="sfx" className="mt-3">
                <div className="bg-card border border-border rounded-sm p-4 space-y-3">
                  <textarea rows={2} placeholder="Describe the sound effect..." value={sfxPrompt}
                    onChange={(e) => setSfxPrompt(e.target.value)}
                    className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none" />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleGenerateSfx} disabled={generatingSfx || !sfxPrompt.trim()} className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm">
                      {generatingSfx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                      {generatingSfx ? "Generating..." : "Generate SFX"}
                    </Button>
                    <span className="text-[10px] text-muted-foreground">ElevenLabs · ~5s clip</span>
                  </div>
                  <div className="border border-dashed border-border rounded-sm p-4">
                    {generatedSfxUrl ? (
                      <audio controls src={generatedSfxUrl} className="w-full h-8" />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground"><Play className="w-3 h-3" /></button>
                          <div className="w-48 h-1 bg-border rounded-full" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">0:00</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Auto Captions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">Auto Captions</label>
              </div>
              <div className="bg-card border border-border rounded-sm p-4">
                <div className="grid md:grid-cols-5 gap-3">
                  {scenes.map((scene) => (
                    <div key={scene.id} className="space-y-1.5">
                      <span className="text-[10px] font-display uppercase tracking-widest text-muted-foreground">Scene {scene.id}</span>
                      <p className="text-xs text-foreground leading-relaxed">{scene.caption}</p>
                      <span className="text-[10px] text-muted-foreground font-mono">{scene.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Final Editor */}
        {currentStep === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <FinalEditorStep scenes={scenes} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation footer */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={goBack}
          disabled={currentStep === 1}
          className="gap-1.5 rounded-sm"
        >
          <ChevronLeft className="w-3 h-3" /> Back
        </Button>
        {currentStep < 4 && (
          <Button
            size="sm"
            onClick={goNext}
            disabled={
              (currentStep === 1 && !canProceedFromStep1) ||
              (currentStep === 2 && !canProceedFromStep2)
            }
            className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 rounded-sm"
          >
            Next <ChevronRight className="w-3 h-3" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
