import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Star,
  MoreHorizontal,
  Code,
  Bookmark,
  Clock,
  UserPlus,
  Trash,
  Edit,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Comment = {
  id: string;
  author: string;
  text: string;
};

type PostCardProps = {
  id?: string;
  author: string;
  avatarUrl?: string;
  content: string;
  timestamp?: string; // ISO string or human readable
  images?: string[];
  codeSnippet?: string; // optional code block
  isOwner?: boolean;
  initialReactions?: {
    likes: number;
    stars: number;
    comments: number;
    shares: number;
  };
  comments?: Comment[];
};

export default function PostCard({
  id = "post-1",
  author,
  avatarUrl,
  content,
  timestamp,
  images = [],
  codeSnippet,
  isOwner = false,
  initialReactions = { likes: 42, stars: 7, comments: 3, shares: 1 },
  comments = [],
}: PostCardProps) {
  // Local interactive state
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [likes, setLikes] = useState(initialReactions.likes);
  const [stars, setStars] = useState(initialReactions.stars);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [commentText, setCommentText] = useState("");

  const toggleLike = () => {
    setLiked((s) => {
      const next = !s;
      setLikes((l) => l + (next ? 1 : -1));
      return next;
    });
  };

  const toggleStar = () => {
    setStarred((s) => {
      const next = !s;
      setStars((st) => st + (next ? 1 : -1));
      return next;
    });
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).slice(2),
      author: "you",
      text: commentText.trim(),
    };
    setLocalComments((c) => [newComment, ...c]);
    setCommentText("");
    setShowComments(true);
  };

  const timeDisplay = timestamp || new Date().toLocaleString();

  return (
    <article
      id={id}
      className="max-w-2xl mx-auto rounded-2xl border border-zinc-400/20 bg-cyber-panel p-4 space-y-4 shadow-[0_10px_30px_rgba(161,161,170,0.06)]"
      aria-live="polite"
    >
      <header className="flex items-start gap-3">
        <img
          src={
            avatarUrl ||
            `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
              author
            )}`
          }
          alt={`${author} avatar`}
          className="w-12 h-12 rounded-full ring-2 ring-zinc-500/40 object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-200">{author}</span>
                <span className="text-xs text-zinc-300/80">• hacker</span>
                <span className="ml-2 text-xs text-zinc-300/70">
                  {timeDisplay}
                </span>
              </div>
              <div className="text-xs mt-1 text-zinc-300/70">
                Exploit hunter • Open-source enthusiast
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu((s) => !s)}
                aria-label="post options"
                className="p-1 rounded-md hover:bg-white/3"
              >
                <MoreHorizontal className="w-5 h-5 text-zinc-200/80" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-44 bg-[#041012] border border-zinc-500/10 rounded-xl shadow-lg p-2 text-sm"
                  >
                    <li>
                      <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-zinc-500/5">
                        <UserPlus className="w-4 h-4" /> Follow
                      </button>
                    </li>
                    {isOwner ? (
                      <>
                        <li>
                          <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-zinc-500/5">
                            <Edit className="w-4 h-4" /> Edit post
                          </button>
                        </li>
                        <li>
                          <button className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-red-600/10 text-red-300">
                            <Trash className="w-4 h-4" /> Delete
                          </button>
                        </li>
                      </>
                    ) : null}
                    <li>
                      <button
                        onClick={() => setSaved((s) => !s)}
                        className="flex items-center gap-2 w-full p-2 rounded-md hover:bg-zinc-500/5"
                      >
                        <Bookmark className="w-4 h-4" />{" "}
                        {saved ? "Saved" : "Save"}
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-3 prose-invert">
            <p className="text-sm leading-relaxed text-zinc-100">{content}</p>
          </div>

          {codeSnippet && (
            <div className="mt-3 rounded-lg overflow-hidden border border-zinc-600/20 bg-[#031317] p-3 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-zinc-300" />
                <span className="text-zinc-200 text-xs">Code snippet</span>
              </div>
              <pre className="whitespace-pre-wrap break-words text-zinc-100/90 text-[12px]">
                {codeSnippet}
              </pre>
            </div>
          )}

          {images.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden border border-zinc-600/10"
                >
                  <img
                    src={src}
                    alt={`post-${i}`}
                    className="object-cover w-full h-52 sm:h-40"
                  />
                </div>
              ))}
            </div>
          )}

          {/* reaction bar */}
          <div className="mt-3 flex items-center justify-between text-sm text-zinc-200/80">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 items-center">
                {/* small avatars representing reactors */}
                <img
                  src={`https://api.dicebear.com/6.x/identicon/svg?seed=alice`}
                  className="w-6 h-6 rounded-full ring-2 ring-[#002419]"
                  alt="a"
                />
                <img
                  src={`https://api.dicebear.com/6.x/identicon/svg?seed=bob`}
                  className="w-6 h-6 rounded-full ring-2 ring-[#002419]"
                  alt="b"
                />
              </div>
              <span className="text-xs">
                {likes} likes • {localComments.length} comments
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-300/60">{stars} ★</span>
              <span className="text-xs text-zinc-300/60">
                {initialReactions.shares} shares
              </span>
            </div>
          </div>

          {/* action buttons */}
          <footer className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleLike}
                className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-zinc-500/5 transition-all ${
                  liked ? "text-zinc-400" : "text-zinc-200/90"
                }`}
                aria-pressed={liked}
              >
                <motion.span
                  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" /> Like
                </motion.span>
              </motion.button>

              <button
                onClick={() => setShowComments((s) => !s)}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-zinc-500/5 text-zinc-200/90"
              >
                <MessageCircle className="w-4 h-4" /> Comment
              </button>

              <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-zinc-500/5 text-zinc-200/90">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleStar}
                className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-zinc-500/5 transition-all ${
                  starred ? "text-amber-300" : "text-zinc-200/90"
                }`}
              >
                <Star className="w-4 h-4" /> Star
              </button>
              <button
                onClick={() => setSaved((s) => !s)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-500/5 ${
                  saved ? "text-zinc-300" : "text-zinc-200/80"
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </footer>

          {/* comments section */}
          <AnimatePresence>
            {showComments && (
              <motion.section
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-zinc-700/10 space-y-3"
              >
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-full bg-[#011213] border border-zinc-700/20 px-4 py-2 text-sm outline-none"
                  />
                  <button
                    onClick={addComment}
                    className="px-4 py-2 rounded-full bg-zinc-500/10 hover:bg-zinc-500/20"
                  >
                    Post
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-auto">
                  {localComments.length === 0 ? (
                    <div className="text-xs text-zinc-300/70">
                      No comments yet — be the first to drop a bug report 🪲
                    </div>
                  ) : (
                    localComments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <img
                          src={`https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
                            c.author
                          )}`}
                          className="w-8 h-8 rounded-full"
                          alt={c.author}
                        />
                        <div className="bg-[#021515] p-2 rounded-xl border border-zinc-700/10">
                          <div className="text-xs font-semibold text-zinc-200">
                            {c.author}
                          </div>
                          <div className="text-sm text-zinc-100/90">
                            {c.text}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </header>
    </article>
  );
}

/*
Integration notes:
- This component uses TailwindCSS classes. Ensure your project has Tailwind configured.
- It also uses `lucide-react` for icons and `framer-motion` for micro-interactions. Install them:
  npm i lucide-react framer-motion
- The "bg-cyber-panel" utility is a project-specific color — add this to your Tailwind theme or replace it with a standard bg like bg-[#001516].
- The component is intentionally interactive but local-only (no backend). Hook the events (like, comment, save) to your API to persist.
- You can pass `codeSnippet` prop to show a highlighted code block inline.
*/
