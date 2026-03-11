import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Music, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const MUSIC_GENRES = [
  "hip-hop", "electronic", "r-and-b", "rock", "lo-fi", "jazz",
  "classical", "pop", "ambient", "metal", "soul", "reggae", "country", "latin", "other",
] as const;

const CONTENT_CATEGORIES = [
  "tutorial", "vlog", "podcast", "cinematic", "asmr", "documentary",
  "music-video", "short-film", "behind-the-scenes", "live-session", "remix", "original", "other",
] as const;

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublished?: () => void;
}

export function PublishDialog({ open, onOpenChange, onPublished }: PublishDialogProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"audio" | "video">("audio");
  const [genre, setGenre] = useState<string>("other");
  const [category, setCategory] = useState<string>("other");
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setContentType("audio");
    setGenre("other");
    setCategory("other");
    setFile(null);
    setThumbnail(null);
  };

  const handlePublish = async () => {
    if (!user || !title.trim() || !file) return;
    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("library-media")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage
        .from("library-media")
        .getPublicUrl(filePath);

      let thumbnailUrl: string | null = null;
      if (thumbnail) {
        const thumbExt = thumbnail.name.split(".").pop();
        const thumbPath = `${user.id}/thumb_${Date.now()}.${thumbExt}`;
        const { error: thumbErr } = await supabase.storage
          .from("library-media")
          .upload(thumbPath, thumbnail);
        if (!thumbErr) {
          const { data: thumbUrl } = supabase.storage
            .from("library-media")
            .getPublicUrl(thumbPath);
          thumbnailUrl = thumbUrl.publicUrl;
        }
      }

      // Get duration from media element
      let duration = 0;
      try {
        const url = URL.createObjectURL(file);
        const el = contentType === "audio" ? new Audio(url) : document.createElement("video");
        await new Promise<void>((resolve) => {
          el.onloadedmetadata = () => { duration = Math.round(el.duration); resolve(); };
          el.onerror = () => resolve();
          if (contentType === "video") (el as HTMLVideoElement).src = url;
        });
        URL.revokeObjectURL(url);
      } catch {}

      const { error: insertErr } = await supabase.from("library_items").insert({
        creator_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        content_type: contentType,
        genre: genre as any,
        category: category as any,
        file_url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        duration_seconds: duration,
      });

      if (insertErr) throw insertErr;

      toast({ title: "Published!", description: "Your content is now live in the library." });
      reset();
      onOpenChange(false);
      onPublished?.();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-gradient-punk">Publish to Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Track or video title" className="mt-1" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about this piece..." className="mt-1 resize-none" rows={2} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as "audio" | "video")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio"><span className="flex items-center gap-1.5"><Music className="w-3 h-3" />Audio</span></SelectItem>
                  <SelectItem value="video"><span className="flex items-center gap-1.5"><Video className="w-3 h-3" />Video</span></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MUSIC_GENRES.map((g) => (
                    <SelectItem key={g} value={g} className="capitalize">{g.replace(/-/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c.replace(/-/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-border rounded-sm p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept={contentType === "audio" ? "audio/*" : "video/*"}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            {file ? (
              <p className="text-sm text-foreground truncate">{file.name}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Click to upload {contentType}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div
            onClick={() => thumbRef.current?.click()}
            className="border border-dashed border-border rounded-sm p-3 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={thumbRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            />
            {thumbnail ? (
              <p className="text-xs text-foreground truncate">🖼 {thumbnail.name}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Add thumbnail (optional)</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handlePublish} disabled={!title.trim() || !file || uploading}>
            {uploading ? "Uploading..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
