import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette, Search, Upload, X, Plus, Eye, Check, ExternalLink, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export interface SelectedStyle {
  keyword: string;
  selectedImages: string[];
  fonts?: string[];
  colorPalette?: string[];
}

interface StyleVibeStepProps {
  selectedStyles: SelectedStyle[];
  onStylesChange: (styles: SelectedStyle[]) => void;
  uploadedImages: string[];
  onUploadedImagesChange: (images: string[]) => void;
}

// Simulated Pinterest moodboard data — in production these would come from Pinterest API / Firecrawl
const MOODBOARD_DATA: Record<string, { images: string[]; fonts: string[]; colors: string[] }> = {
  noir: {
    images: [
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    ],
    fonts: ["Playfair Display", "Cormorant", "Bodoni Moda"],
    colors: ["#0a0a0a", "#1a1a1a", "#2d2d2d", "#f5f5f5", "#8b8b8b"],
  },
  "french new wave": {
    images: [
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504198266287-1659872e6590?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=400&fit=crop",
    ],
    fonts: ["Libre Baskerville", "EB Garamond", "Spectral"],
    colors: ["#f0e6d3", "#2c2c2c", "#6b4423", "#e8d5b7", "#4a4a4a"],
  },
  "old money": {
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=300&h=400&fit=crop",
    ],
    fonts: ["Cormorant Garamond", "Lora", "Crimson Text"],
    colors: ["#2c3e2d", "#8b7d6b", "#f5f0e8", "#4a3728", "#c4b5a0"],
  },
  gothic: {
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1509136561942-7d8663edaaa2?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&h=400&fit=crop",
    ],
    fonts: ["UnifrakturMaguntia", "Cinzel", "Abril Fatface"],
    colors: ["#0d0d0d", "#2d0a0a", "#4a0e0e", "#d4d4d4", "#8b0000"],
  },
  cyberpunk: {
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=300&h=400&fit=crop",
    ],
    fonts: ["Orbitron", "Rajdhani", "Share Tech Mono"],
    colors: ["#0a0a1a", "#00ff88", "#ff0066", "#0088ff", "#1a1a2e"],
  },
  minimal: {
    images: [
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=300&h=400&fit=crop",
    ],
    fonts: ["Inter", "DM Sans", "Instrument Sans"],
    colors: ["#ffffff", "#f5f5f5", "#e0e0e0", "#1a1a1a", "#666666"],
  },
  vintage: {
    images: [
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=300&h=400&fit=crop",
    ],
    fonts: ["Libre Baskerville", "Merriweather", "Old Standard TT"],
    colors: ["#f4e9d8", "#d4a574", "#8b6914", "#3c2f1e", "#6b5b45"],
  },
  brutalist: {
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=400&fit=crop",
    ],
    fonts: ["Space Grotesk", "Archivo Black", "Anton"],
    colors: ["#1a1a1a", "#808080", "#c0c0c0", "#ffffff", "#333333"],
  },
};

const SUGGESTED_KEYWORDS = [
  "noir", "french new wave", "old money", "gothic", "cyberpunk",
  "minimal", "vintage", "brutalist", "vaporwave", "dark academia",
  "cottagecore", "art deco", "y2k", "grunge", "ethereal",
  "maximalist", "pastel", "neon", "monochrome", "tropical",
  "industrial", "bohemian", "retro futurism", "solarpunk", "glitch",
];

export default function StyleVibeStep({
  selectedStyles,
  onStylesChange,
  uploadedImages,
  onUploadedImagesChange,
}: StyleVibeStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeBoardKeyword, setActiveBoardKeyword] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredKeywords = searchQuery.trim()
    ? SUGGESTED_KEYWORDS.filter((k) => k.includes(searchQuery.toLowerCase()))
    : SUGGESTED_KEYWORDS;

  // Show custom keyword if typed and not in suggestions
  const showCustomKeyword =
    searchQuery.trim() &&
    !SUGGESTED_KEYWORDS.includes(searchQuery.toLowerCase().trim());

  const handleKeywordClick = (keyword: string) => {
    setActiveBoardKeyword(keyword);
    setIsSearching(true);
    // Simulate Pinterest board loading
    setTimeout(() => setIsSearching(false), 600);
  };

  const isKeywordSelected = (keyword: string) =>
    selectedStyles.some((s) => s.keyword === keyword);

  const toggleImageSelection = (keyword: string, imageUrl: string) => {
    const existing = selectedStyles.find((s) => s.keyword === keyword);
    if (existing) {
      const hasImage = existing.selectedImages.includes(imageUrl);
      if (hasImage) {
        const newImages = existing.selectedImages.filter((i) => i !== imageUrl);
        if (newImages.length === 0) {
          onStylesChange(selectedStyles.filter((s) => s.keyword !== keyword));
        } else {
          onStylesChange(
            selectedStyles.map((s) =>
              s.keyword === keyword ? { ...s, selectedImages: newImages } : s
            )
          );
        }
      } else {
        onStylesChange(
          selectedStyles.map((s) =>
            s.keyword === keyword
              ? { ...s, selectedImages: [...s.selectedImages, imageUrl] }
              : s
          )
        );
      }
    } else {
      const boardData = getMoodboardData(keyword);
      onStylesChange([
        ...selectedStyles,
        {
          keyword,
          selectedImages: [imageUrl],
          fonts: boardData.fonts,
          colorPalette: boardData.colors,
        },
      ]);
    }
  };

  const getMoodboardData = (keyword: string) => {
    const key = keyword.toLowerCase();
    return (
      MOODBOARD_DATA[key] || {
        // Fallback for custom keywords — generate placeholder board
        images: [
          `https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=400&fit=crop`,
          `https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=300&h=400&fit=crop`,
          `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=400&fit=crop`,
          `https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=400&fit=crop`,
          `https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=400&fit=crop`,
          `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=400&fit=crop`,
        ],
        fonts: ["Space Grotesk", "Inter", "DM Sans"],
        colors: ["#1a1a1a", "#333333", "#666666", "#999999", "#ffffff"],
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUploadedImagesChange([...uploadedImages, ev.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const boardData = activeBoardKeyword ? getMoodboardData(activeBoardKeyword) : null;
  const activeStyleImages = activeBoardKeyword
    ? selectedStyles.find((s) => s.keyword === activeBoardKeyword)?.selectedImages || []
    : [];

  const totalSelectedImages = selectedStyles.reduce(
    (acc, s) => acc + s.selectedImages.length,
    0
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
          Style & Vibe Selector
        </label>
        {totalSelectedImages > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {totalSelectedImages} images selected across {selectedStyles.length} styles
          </Badge>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search style keywords... (noir, cyberpunk, old money, y2k...)"
          className="pl-9 bg-card border-border text-sm rounded-sm"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Keywords column */}
        <div className="lg:col-span-2 space-y-3">
          <span className="text-[11px] text-muted-foreground">
            Tap a keyword to load its moodboard
          </span>
          <ScrollArea className="h-[420px]">
            <div className="flex flex-wrap gap-1.5 pr-3">
              {showCustomKeyword && (
                <button
                  onClick={() => handleKeywordClick(searchQuery.trim().toLowerCase())}
                  className={`px-3 py-1.5 rounded-sm text-[11px] border transition-all border-dashed border-foreground/30 text-foreground hover:bg-accent`}
                >
                  <Plus className="w-2.5 h-2.5 inline mr-1" />
                  "{searchQuery.trim()}"
                </button>
              )}
              {filteredKeywords.map((keyword) => {
                const isActive = activeBoardKeyword === keyword;
                const isSelected = isKeywordSelected(keyword);
                return (
                  <button
                    key={keyword}
                    onClick={() => handleKeywordClick(keyword)}
                    className={`px-3 py-1.5 rounded-sm text-[11px] border transition-all capitalize ${
                      isActive
                        ? "border-foreground/50 bg-foreground/10 text-foreground"
                        : isSelected
                        ? "border-foreground/30 bg-accent text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 inline mr-1" />}
                    {keyword}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Upload reference images */}
          <div className="bg-card border border-border rounded-sm p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                Upload Reference Images
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] text-foreground flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-1.5">
                {uploadedImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative group aspect-square rounded-sm overflow-hidden border border-border"
                  >
                    <img
                      src={img}
                      alt={`ref-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        onUploadedImagesChange(
                          uploadedImages.filter((_, idx) => idx !== i)
                        )
                      }
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-sm p-4 flex flex-col items-center gap-1.5">
                <Upload className="w-4 h-4 text-muted-foreground/40" />
                <p className="text-[10px] text-muted-foreground text-center">
                  Pinterest boards, screenshots, or mood references
                </p>
              </div>
            )}
            {uploadedImages.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5 text-xs rounded-sm"
              >
                <Eye className="w-3 h-3" /> Analyze Uploaded Vibes
              </Button>
            )}
          </div>
        </div>

        {/* Moodboard display */}
        <div className="lg:col-span-3 space-y-3">
          {activeBoardKeyword && boardData ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBoardKeyword}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-3"
              >
                {/* Board header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-display font-medium text-foreground capitalize">
                      {activeBoardKeyword}
                    </h3>
                    <span className="text-[10px] text-muted-foreground">
                      Moodboard · {boardData.images.length} images
                    </span>
                  </div>
                  <a
                    href={`https://pinterest.com/search/pins/?q=${encodeURIComponent(activeBoardKeyword + " aesthetic")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Open on Pinterest <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Suggested fonts & colors */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">Fonts:</span>
                    {boardData.fonts.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-1.5 py-0.5 bg-accent rounded-sm text-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">Colors:</span>
                    {boardData.colors.map((c) => (
                      <div
                        key={c}
                        className="w-4 h-4 rounded-sm border border-border"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* Image grid */}
                {isSearching ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] rounded-sm bg-accent animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {boardData.images.map((img, i) => {
                      const isImgSelected = activeStyleImages.includes(img);
                      return (
                        <motion.div
                          key={img}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() =>
                            toggleImageSelection(activeBoardKeyword, img)
                          }
                          className={`relative aspect-[3/4] rounded-sm overflow-hidden border-2 cursor-pointer transition-all group ${
                            isImgSelected
                              ? "border-foreground/60 ring-1 ring-foreground/20"
                              : "border-transparent hover:border-muted-foreground/20"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${activeBoardKeyword}-${i}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div
                            className={`absolute inset-0 bg-background/40 flex items-center justify-center transition-opacity ${
                              isImgSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {isImgSelected ? (
                              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                                <Check className="w-3 h-3 text-background" />
                              </div>
                            ) : (
                              <Heart className="w-5 h-5 text-foreground" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground text-center">
                  Click images to select them as style references for AI
                  generation
                </p>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="border border-dashed border-border rounded-sm h-[420px] flex flex-col items-center justify-center gap-3">
              <Palette className="w-8 h-8 text-muted-foreground/30" />
              <div className="text-center space-y-1">
                <p className="text-xs text-muted-foreground">
                  Select a style keyword to load its moodboard
                </p>
                <p className="text-[10px] text-muted-foreground/60">
                  You can search or type custom keywords too
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected styles summary */}
      {selectedStyles.length > 0 && (
        <div className="bg-card border border-border rounded-sm p-4 space-y-3">
          <span className="text-[11px] font-display uppercase tracking-wider text-muted-foreground">
            Selected Style Combination
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedStyles.map((style) => (
              <div
                key={style.keyword}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent border border-border rounded-sm"
              >
                <span className="text-xs text-foreground capitalize">
                  {style.keyword}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {style.selectedImages.length} img
                </span>
                <button
                  onClick={() =>
                    onStylesChange(
                      selectedStyles.filter((s) => s.keyword !== style.keyword)
                    )
                  }
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {selectedStyles.flatMap((s) =>
              s.selectedImages.map((img) => (
                <img
                  key={img}
                  src={img}
                  alt="selected"
                  className="w-12 h-16 object-cover rounded-sm border border-border shrink-0"
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
