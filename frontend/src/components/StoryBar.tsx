import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  Camera,
  Sparkles,
  SmilePlus,
} from "lucide-react"; // use SmilePlus (or Smile) instead of EmojiHappy [web:13][web:9]

type Story = {
  id: number;
  user: string;
  title: string;
  type: "text" | "image" | "video";
  content: string;
  likes: number;
  hasLiked?: boolean;
  timestamp: string;
  filter?: string;
  mentions?: string[];
  location?: string;
};

export default function StoryBar() {
  const [stories, setStories] = useState<Story[]>([
    {
      id: 1,
      user: "0xRaven",
      title: "CTF writeup",
      type: "text",
      content:
        "Full CTF writeup: Exploiting buffer overflow in challenge 03...",
      likes: 42,
      timestamp: "2h ago",
      location: "DEF CON 33",
      mentions: ["@bytehunter", "@hackmaster"],
    },
  ]);

  // NEW: define all state that is referenced below
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // was missing [web:13]
  const [progress, setProgress] = useState<number>(0); // was missing [web:13]
  const [showUploader, setShowUploader] = useState<boolean>(false); // was missing [web:13]

  const [filters, setFilters] = useState<string[]>([
    "Cyber",
    "Matrix",
    "Glitch",
    "Hacker",
    "Terminal",
  ]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showReactions, setShowReactions] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  // Auto‑advance progress when a story is open
  useEffect(() => {
    if (activeIndex === null) return; // nothing open
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          // close or advance to next
          setActiveIndex((i) => {
            if (i === null) return null;
            const next = i + 1;
            return next < stories.length ? next : null;
          });
          return 100;
        }
        return p + 2; // ~5s bar (adjust increment)
      });
    }, 100);
    return () => clearInterval(id);
  }, [activeIndex, stories.length]); // ensure cleanup [web:13]

  const handleLike = (storyId: number) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? {
              ...s,
              likes: s.hasLiked ? s.likes - 1 : s.likes + 1,
              hasLiked: !s.hasLiked,
            }
          : s
      )
    );
  };

  // Helper to build current DiceBear URL (v9)
  const avatarUrl = (seed: string) =>
    `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
      seed
    )}`; // update from 6.x to 9.x [web:5]

  return (
    <div className="space-y-4">
      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-zinc-400">
        {/* Create Story Button - Enhanced */}
        <button
          onClick={() => setShowUploader(true)}
          className="relative group"
        >
          <div className="w-20 h-20 rounded-full border-2 border-zinc-400 flex items-center justify-center bg-gradient-to-br from-zinc-400/20 to-cyber-panel group-hover:from-zinc-400/40 transition-all duration-300">
            <span className="text-2xl text-zinc-400 group-hover:scale-110 transition-transform">
              +
            </span>
          </div>
          <div className="absolute -bottom-1 right-0 w-8 h-8 rounded-full bg-zinc-500 text-black flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4" />
          </div>
          <span className="mt-2 text-xs text-zinc-300 block text-center">
            Create
          </span>
        </button>

        {/* Story Circles - Enhanced */}
        {stories.map((s, index) => (
          <div
            key={s.id}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => setActiveIndex(index)}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-br from-zinc-400 via-cyber-neon to-cyber-neon2 group-hover:from-zinc-300 group-hover:to-cyber-accent transition-all duration-300">
                <div className="w-full h-full rounded-full border-2 border-black p-[2px] bg-cyber-panel flex items-center justify-center overflow-hidden">
                  <img
                    src={avatarUrl(s.user)} // updated URL
                    className="w-full h-full rounded-full object-cover"
                    alt={s.user}
                  />
                </div>
              </div>
              {s.hasLiked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-400 text-black flex items-center justify-center text-xs shadow-glow">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
            <span className="text-xs mt-1 text-zinc-300 group-hover:text-zinc-200">
              @{s.user}
            </span>
          </div>
        ))}
      </div>

      {/* Story Modal - Enhanced */}
      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
          <div className="bg-cyber-panel border border-zinc-400/50 p-6 rounded-xl shadow-[0_0_35px_rgba(161,161,170,0.5)] max-w-md w-full relative">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={avatarUrl(stories[activeIndex].user)}
                className="w-10 h-10 rounded-full border border-zinc-400"
                alt={stories[activeIndex].user}
              />
              <div>
                <h2 className="font-bold text-zinc-400">
                  @{stories[activeIndex].user}
                </h2>
                {stories[activeIndex].location && (
                  <p className="text-xs text-zinc-300">
                    {stories[activeIndex].location}
                  </p>
                )}
              </div>
              <span className="ml-auto text-xs text-zinc-300">
                {stories[activeIndex].timestamp}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-2 left-0 w-full h-1 bg-zinc-900/50">
              <div
                className="h-1 bg-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.8)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Content with Effects */}
            <div className={`relative ${selectedFilter}`}>
              {stories[activeIndex].type === "text" && (
                <p className="text-zinc-300 text-center text-lg leading-relaxed">
                  {stories[activeIndex].content}
                </p>
              )}
              {/* image/video handlers here */}
            </div>

            {/* Interactive Buttons */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-4">
                <button
                  onClick={() => handleLike(stories[activeIndex].id)}
                  className={`${
                    stories[activeIndex].hasLiked
                      ? "text-red-400"
                      : "text-zinc-300"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${
                      stories[activeIndex].hasLiked ? "fill-current" : ""
                    }`}
                  />
                </button>
                <button className="text-zinc-300">
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className="text-zinc-300">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button className="text-zinc-300">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes Counter */}
            <div className="mt-2 text-sm text-zinc-300">
              {stories[activeIndex].likes} likes
            </div>

            {/* Story Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setShowEffects(true)}
                className="p-2 rounded-full bg-zinc-500/20 hover:bg-zinc-500/30"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowReactions(true)}
                className="p-2 rounded-full bg-zinc-500/20 hover:bg-zinc-500/30"
              >
                <SmilePlus className="w-5 h-5" /> {/* was EmojiHappy */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
