import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image, Video, X, Upload, Sparkles } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<"video" | "image">("video");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [publishAs, setPublishAs] = useState<"post" | "story">("post");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => URL.createObjectURL(f));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = () => {
    // In the future, this will call the backend
    console.log("Publishing:", { content, mediaType, uploadedFiles, publishAs });
    setContent("");
    setUploadedFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Publish type */}
          <Tabs value={publishAs} onValueChange={(v) => setPublishAs(v as "post" | "story")}>
            <TabsList className="bg-background border border-border rounded-sm h-8">
              <TabsTrigger value="post" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
                Feed Post
              </TabsTrigger>
              <TabsTrigger value="story" className="text-[10px] rounded-sm data-[state=active]:bg-accent">
                Story
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Text content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What are you creating today?"
            className="w-full bg-background border border-border rounded-sm p-3 text-sm text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          />

          {/* Media type selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setMediaType("image")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${
                mediaType === "image"
                  ? "border-foreground/30 text-foreground bg-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              Image
            </button>
            <button
              onClick={() => setMediaType("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs border transition-colors ${
                mediaType === "video"
                  ? "border-foreground/30 text-foreground bg-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video / Reel
            </button>
          </div>

          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-sm p-6 text-center cursor-pointer hover:border-muted-foreground/30 transition-colors"
          >
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Click to upload {mediaType === "video" ? "video" : "images"}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              {mediaType === "video" ? "MP4, MOV up to 100MB" : "JPG, PNG, WEBP up to 20MB"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === "video" ? "video/*" : "image/*"}
              multiple={mediaType === "image"}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Uploaded previews */}
          {uploadedFiles.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {uploadedFiles.map((file, i) => (
                <div key={i} className="relative w-20 h-20 rounded-sm overflow-hidden border border-border">
                  {mediaType === "image" ? (
                    <img src={file} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={file} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => removeFile(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-background/80 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-sm"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            disabled={!content && uploadedFiles.length === 0}
            className="rounded-sm gap-1.5 bg-foreground text-background hover:bg-foreground/90"
          >
            <Sparkles className="w-3 h-3" />
            {publishAs === "story" ? "Share Story" : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
