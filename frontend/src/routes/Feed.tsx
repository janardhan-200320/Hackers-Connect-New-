import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Code2,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { mockPosts } from "@/lib/mockData";
import CodeEditor from "@/components/CodeEditor";
import { usePost } from "@/contexts/PostContext";

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const { isCreatePostOpen, setIsCreatePostOpen } = usePost();
  const [postContent, setPostContent] = useState("");
  const [postCode, setPostCode] = useState("");
  const [postTitle, setPostTitle] = useState("");

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleCreatePost = () => {
    if (!postContent.trim() && !postCode.trim()) return;

    const newPost = {
      id: String(posts.length + 1),
      author: mockPosts[0].author, // Using current user
      content: postContent,
      code: postCode || undefined,
      title: postTitle || undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      images: [],
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
    setPostCode("");
    setPostTitle("");
    setIsCreatePostOpen(false);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Create Post Trigger */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex gap-3">
          <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Avatar.Image src={mockPosts[0].author.avatar} />
            <Avatar.Fallback className="bg-zinc-700">
              {mockPosts[0].author.username[0]}
            </Avatar.Fallback>
          </Avatar.Root>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-500 text-left hover:border-zinc-600 transition"
          >
            Share your latest discovery...
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 pl-13">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
          >
            <Code2 className="w-4 h-4" />
            Code
          </button>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition"
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog.Root open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 shadow-2xl animate-in fade-in zoom-in-95">
            {/* Dialog Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-bold text-zinc-100">
                Create Post
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-lg transition">
                <X className="w-5 h-5 text-zinc-400" />
              </Dialog.Close>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
              <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
                <Avatar.Image src={mockPosts[0].author.avatar} />
                <Avatar.Fallback className="bg-zinc-700">
                  {mockPosts[0].author.username[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <p className="font-medium text-zinc-100">
                  {mockPosts[0].author.fullName}
                </p>
                <p className="text-sm text-zinc-500">
                  @{mockPosts[0].author.username}
                </p>
              </div>
            </div>

            {/* Post Form */}
            <div className="space-y-4">
              {/* Title (Optional) */}
              <div>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-lg font-semibold text-zinc-100 placeholder-zinc-600"
                />
              </div>

              {/* Content */}
              <div>
                <textarea
                  placeholder="What's on your mind? Share your findings, exploits, or cybersecurity insights..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={6}
                  className="w-full bg-transparent border border-zinc-800 rounded-lg p-3 outline-none resize-none text-zinc-100 placeholder-zinc-600 focus:border-zinc-700"
                />
              </div>

              {/* Code Editor */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Code Snippet (optional)
                </label>
                <CodeEditor value={postCode} onChange={setPostCode} />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-zinc-300">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-zinc-300">
                    <LinkIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-zinc-300">
                    <Code2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog.Close className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition">
                    Cancel
                  </Dialog.Close>
                  <button
                    onClick={handleCreatePost}
                    disabled={!postContent.trim() && !postCode.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Posts Feed */}
      {posts.map((post) => {
        const isLiked = likedPosts.has(post.id);
        const isSaved = savedPosts.has(post.id);

        return (
          <article
            key={post.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Avatar.Image src={post.author.avatar} />
                  <Avatar.Fallback className="bg-zinc-700">
                    {post.author.username[0]}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-100">
                      {post.author.fullName}
                    </span>
                    <span className="text-xs text-zinc-500">
                      @{post.author.username}
                    </span>
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs text-zinc-500">
                      {formatTime(post.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{post.author.bio}</p>
                </div>
              </div>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-1 hover:bg-zinc-800 rounded-lg transition">
                    <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-1 z-50">
                    <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none">
                      Report
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none">
                      Hide
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            {/* Post Content */}
            <div className="mb-3">
              <p className="text-sm text-zinc-200 mb-3">{post.content}</p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Code Snippet */}
              {post.codeSnippet && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 mb-3 overflow-x-auto">
                  <pre className="text-xs text-zinc-300 font-mono">
                    {post.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className="rounded-lg overflow-hidden">
                  <img src={post.images[0]} alt="Post" className="w-full" />
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                    isLiked
                      ? "text-red-500 hover:bg-red-500/10"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-xs font-medium">
                    {post.likes + (isLiked ? 1 : 0)}
                  </span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-medium">{post.shares}</span>
                </button>
              </div>

              <button
                onClick={() => toggleSave(post.id)}
                className={`p-1.5 rounded-lg transition ${
                  isSaved
                    ? "text-blue-500 hover:bg-blue-500/10"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
