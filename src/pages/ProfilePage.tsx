import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Grid3X3,
  Play,
  Bookmark,
  Link as LinkIcon,
  MapPin,
  Calendar,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { PostCard, PostData } from "@/components/social/PostCard";

const mockCreators: Record<string, {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joined: string;
  followers: number;
  following: number;
  posts: number;
}> = {
  maya: {
    name: "Maya Chen",
    handle: "mayacreates",
    avatar: "M",
    bio: "Filmmaker & visual storyteller. Noir aesthetics. Creating cinematic content with AI tools.",
    location: "Los Angeles, CA",
    website: "mayachen.studio",
    joined: "Jan 2025",
    followers: 12400,
    following: 340,
    posts: 87,
  },
  jordan: {
    name: "Jordan Vega",
    handle: "jordancuts",
    avatar: "J",
    bio: "Video editor & content strategist. Old money aesthetics meet modern storytelling.",
    location: "New York, NY",
    website: "jordanvega.co",
    joined: "Mar 2025",
    followers: 28900,
    following: 210,
    posts: 142,
  },
  alex: {
    name: "Alex Rivera",
    handle: "alexmakes",
    avatar: "A",
    bio: "Series creator & podcast host. Building in public. 📹",
    location: "Austin, TX",
    website: "alexrivera.me",
    joined: "Feb 2025",
    followers: 5600,
    following: 890,
    posts: 53,
  },
};

const defaultCreator = {
  name: "Creator",
  handle: "creator",
  avatar: "?",
  bio: "Content creator on CreatorOS.",
  location: "Earth",
  website: "",
  joined: "2025",
  followers: 0,
  following: 0,
  posts: 0,
};

const mockPortfolio = Array.from({ length: 9 }, (_, i) => ({
  id: `p${i}`,
  type: i % 3 === 0 ? "video" as const : "image" as const,
}));

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const creator = mockCreators[id ?? ""] ?? defaultCreator;
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "saved">("posts");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-xl mx-auto"
    >
      {/* Back */}
      <Link
        to="/feed"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </Link>

      {/* Profile Header */}
      <div className="border border-border rounded-sm bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-xl font-display font-bold text-accent-foreground shrink-0">
            {creator.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-lg font-display font-bold text-foreground">{creator.name}</h1>
                <p className="text-sm text-muted-foreground">@{creator.handle}</p>
              </div>
              <button
                onClick={() => setFollowing(!following)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  following
                    ? "bg-accent text-foreground border border-border"
                    : "bg-foreground text-background"
                }`}
              >
                {following ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{creator.bio}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
              {creator.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {creator.location}
                </span>
              )}
              {creator.website && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" />
                  {creator.website}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined {creator.joined}
              </span>
            </div>

            <div className="flex gap-5 mt-4">
              <div>
                <span className="text-sm font-bold text-foreground">{fmt(creator.followers)}</span>
                <span className="text-xs text-muted-foreground ml-1">Followers</span>
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">{fmt(creator.following)}</span>
                <span className="text-xs text-muted-foreground ml-1">Following</span>
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">{creator.posts}</span>
                <span className="text-xs text-muted-foreground ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Tabs */}
      <div className="flex border-b border-border">
        {([
          { id: "posts" as const, label: "Posts", icon: Grid3X3 },
          { id: "reels" as const, label: "Reels", icon: Play },
          { id: "saved" as const, label: "Saved", icon: Bookmark },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-3 gap-1">
        {mockPortfolio.map((item) => (
          <div
            key={item.id}
            className="aspect-square bg-muted rounded-sm relative group cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">
                {item.type}
              </span>
            </div>
            {item.type === "video" && (
              <div className="absolute top-1.5 right-1.5">
                <Play className="w-3 h-3 text-muted-foreground fill-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
