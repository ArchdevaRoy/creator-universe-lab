import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Play,
} from "lucide-react";

export interface PostData {
  id: string;
  author: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  mediaType: "video" | "image";
  mediaThumbnail: string;
  likes: number;
  comments: number;
  reposts: number;
  shares: number;
  timeAgo: string;
  isLiked?: boolean;
  isReposted?: boolean;
  isSaved?: boolean;
}

interface PostCardProps {
  post: PostData;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reposted, setReposted] = useState(post.isReposted ?? false);
  const [repostCount, setRepostCount] = useState(post.reposts);
  const [saved, setSaved] = useState(post.isSaved ?? false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const toggleRepost = () => {
    setReposted(!reposted);
    setRepostCount((c) => (reposted ? c - 1 : c + 1));
  };

  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-sm bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <Link to={`/profile/${post.author.id}`} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-xs font-display font-bold text-accent-foreground">
            {post.author.avatar}
          </div>
          <div>
            <span className="text-sm font-medium text-foreground group-hover:underline">
              {post.author.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              @{post.author.handle} · {post.timeAgo}
            </span>
          </div>
        </Link>
        <button className="p-1.5 rounded-sm hover:bg-accent text-muted-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm text-foreground/90 leading-relaxed">{post.content}</p>

      {/* Media */}
      <div className="relative aspect-[9/16] max-h-[480px] bg-muted mx-4 rounded-sm overflow-hidden mb-3">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground text-xs font-display uppercase tracking-widest">
            {post.mediaType === "video" ? "Video Preview" : "Image"}
          </div>
        </div>
        {post.mediaType === "video" && (
          <button className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-5 h-5 text-foreground fill-foreground" />
            </div>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs transition-colors ${
              liked
                ? "text-destructive"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-destructive" : ""}`} />
            {fmt(likeCount)}
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />
            {fmt(post.comments)}
          </button>
          <button
            onClick={toggleRepost}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs transition-colors ${
              reposted
                ? "text-green-500"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Repeat2 className="w-4 h-4" />
            {fmt(repostCount)}
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Share className="w-4 h-4" />
            {fmt(post.shares)}
          </button>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`p-1.5 rounded-sm transition-colors ${
            saved ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? "fill-foreground" : ""}`} />
        </button>
      </div>
    </motion.article>
  );
}
