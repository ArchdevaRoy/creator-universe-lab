import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Users } from "lucide-react";
import { StoriesBar } from "@/components/social/StoriesBar";
import { PostCard, PostData } from "@/components/social/PostCard";

const mockPosts: PostData[] = [
  {
    id: "1",
    author: { id: "maya", name: "Maya Chen", handle: "mayacreates", avatar: "M" },
    content: "Just dropped a new noir-style reel using CreatorOS Script Studio. The vibe analyzer nailed the aesthetic 🎬🖤",
    mediaType: "video",
    mediaThumbnail: "",
    likes: 342,
    comments: 28,
    reposts: 45,
    shares: 12,
    timeAgo: "2h",
  },
  {
    id: "2",
    author: { id: "jordan", name: "Jordan Vega", handle: "jordancuts", avatar: "J" },
    content: "Old money aesthetics + AI voiceover = chef's kiss. This workflow is unreal.",
    mediaType: "video",
    mediaThumbnail: "",
    likes: 891,
    comments: 67,
    reposts: 120,
    shares: 34,
    timeAgo: "4h",
    isLiked: true,
  },
  {
    id: "3",
    author: { id: "alex", name: "Alex Rivera", handle: "alexmakes", avatar: "A" },
    content: "Behind the scenes of my latest series — 12 episodes planned with Series Builder 📋",
    mediaType: "image",
    mediaThumbnail: "",
    likes: 156,
    comments: 14,
    reposts: 8,
    shares: 5,
    timeAgo: "6h",
  },
  {
    id: "4",
    author: { id: "priya", name: "Priya Sharma", handle: "priyaedits", avatar: "P" },
    content: "Gothic punk typography + AI SFX. The final editor timeline makes mixing so smooth 🔊",
    mediaType: "video",
    mediaThumbnail: "",
    likes: 2100,
    comments: 189,
    reposts: 310,
    shares: 88,
    timeAgo: "8h",
  },
  {
    id: "5",
    author: { id: "sam", name: "Sam Okafor", handle: "samcreates", avatar: "S" },
    content: "Repurposed one 10-min video into 5 reels, 3 carousels, and a newsletter. Repurpose Lab is wild.",
    mediaType: "image",
    mediaThumbnail: "",
    likes: 445,
    comments: 52,
    reposts: 67,
    shares: 19,
    timeAgo: "12h",
  },
];

const tabs = [
  { id: "foryou", label: "For You", icon: Sparkles },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "following", label: "Following", icon: Users },
  { id: "latest", label: "Latest", icon: Clock },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gradient-punk">
          Creator Feed
        </h1>
        <p className="text-muted-foreground mt-1 font-body text-sm">
          Discover and share with the creator community.
        </p>
      </motion.div>

      {/* Stories */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <StoriesBar />
      </motion.div>

      <div className="glow-line w-full" />

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </motion.div>
  );
}
