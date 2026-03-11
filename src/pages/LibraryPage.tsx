import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Music, Video, Flame, Filter, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LibraryCard } from "@/components/library/LibraryCard";
import { PublishDialog } from "@/components/library/PublishDialog";
import { supabase } from "@/integrations/supabase/client";

const MUSIC_GENRES = [
  "all", "hip-hop", "electronic", "r-and-b", "rock", "lo-fi", "jazz",
  "classical", "pop", "ambient", "metal", "soul", "reggae", "country", "latin", "other",
];

const CONTENT_CATEGORIES = [
  "all", "tutorial", "vlog", "podcast", "cinematic", "asmr", "documentary",
  "music-video", "short-film", "behind-the-scenes", "live-session", "remix", "original", "other",
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Played" },
  { value: "karma", label: "Top Karma" },
];

export default function LibraryPage() {
  const [publishOpen, setPublishOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState<"all" | "audio" | "video">("all");
  const [genre, setGenre] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  const fetchItems = async () => {
    setLoading(true);
    let query = supabase
      .from("library_items")
      .select("*, profiles!library_items_creator_id_fkey(display_name, avatar_url)")
      .order(
        sort === "popular" ? "play_count" : sort === "karma" ? "karma_total" : "created_at",
        { ascending: false }
      );

    if (contentType !== "all") query = query.eq("content_type", contentType);
    if (genre !== "all") query = query.eq("genre", genre as any);
    if (category !== "all") query = query.eq("category", category as any);
    if (search.trim()) query = query.ilike("title", `%${search.trim()}%`);

    const { data, error } = await query;
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [contentType, genre, category, sort]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(fetchItems, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("library-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "library_items" }, () => {
        fetchItems();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-punk flex items-center gap-2">
            <Library className="w-7 h-7" /> Creator Library
          </h1>
          <p className="text-muted-foreground mt-1 font-body text-sm">
            Publish, discover, and earn karma from audio &amp; video content.
          </p>
        </div>
        <Button onClick={() => setPublishOpen(true)} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Publish
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search library..."
            className="pl-8 h-9 text-sm"
          />
        </div>

        {/* Content type toggle */}
        <div className="flex gap-0.5 bg-muted/50 rounded-sm p-0.5">
          {(["all", "audio", "video"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setContentType(t)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                contentType === t ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "audio" && <Music className="w-3 h-3" />}
              {t === "video" && <Video className="w-3 h-3" />}
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            {MUSIC_GENRES.map((g) => (
              <SelectItem key={g} value={g} className="capitalize text-xs">
                {g === "all" ? "All Genres" : g.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize text-xs">
                {c === "all" ? "All Categories" : c.replace(/-/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[120px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glow-line w-full" />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-sm animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3">
          <Flame className="w-10 h-10 mx-auto text-primary/40" />
          <p className="text-muted-foreground text-sm">No content yet. Be the first to publish!</p>
          <Button variant="outline" size="sm" onClick={() => setPublishOpen(true)} className="gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Publish Content
          </Button>
        </div>
      )}

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} onPublished={fetchItems} />
    </motion.div>
  );
}
