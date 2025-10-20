import { useState, useRef } from "react";
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
  Copy,
  ExternalLink,
  Send,
  ThumbsUp,
  Smile,
  Zap,
  Eye,
  TrendingUp,
  Award,
  Upload,
  File,
  FileText,
  Video,
  Music,
  Archive,
  Paperclip,
  Trash2,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { mockPosts } from "@/lib/mockData";
import CodeEditor from "@/components/CodeEditor";
import { usePost } from "@/contexts/PostContext";
import { toast } from "sonner";

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState<string | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [postReactions, setPostReactions] = useState<Record<string, string>>({});
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isCreatePostOpen, setIsCreatePostOpen } = usePost();

  // Post creation states
  const [postContent, setPostContent] = useState("");
  const [postCode, setPostCode] = useState("");
  const [postTitle, setPostTitle] = useState("");

  // Delete post function
  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    setDeleteConfirmOpen(null);
    toast.success("🗑️ Post deleted successfully!");
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSave = (postId: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success("📚 Removed from saved posts");
      } else {
        newSet.add(postId);
        toast.success("📚 Post saved!");
      }
      return newSet;
    });
  };

  const handleReaction = (postId: string, reaction: string) => {
    setPostReactions(prev => ({
      ...prev,
      [postId]: prev[postId] === reaction ? "" : reaction
    }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleComment = (postId: string) => {
    const comment = commentTexts[postId]?.trim();
    if (!comment) return;

    toast.success("💬 Comment added!");
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`File "${file.name}" is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      toast.success(`📎 Added "${file.name}" to your post`);
    });

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const removedFile = uploadedFiles[index];
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info(`🗑️ Removed "${removedFile.name}"`);
  };

  const simulateFileUpload = async (files: File[]): Promise<string[]> => {
    setIsUploading(true);

    const uploadPromises = files.map(async (file, index) => {
      await new Promise(resolve => setTimeout(resolve, 1000 + index * 500));
      // Return a mock URL for the uploaded file
      return `https://files.hackersconnect.com/${Date.now()}_${file.name}`;
    });

    const urls = await Promise.all(uploadPromises);
    setIsUploading(false);
    return urls;
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !postCode.trim() && uploadedFiles.length === 0) {
      toast.error("Please add some content, code, or files to your post");
      return;
    }

    try {
      let fileUrls: string[] = [];
      
      // Upload files if any
      if (uploadedFiles.length > 0) {
        toast.info("📤 Uploading files...");
        fileUrls = await simulateFileUpload(uploadedFiles);
        toast.success("✅ Files uploaded successfully!");
      }

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
        images: fileUrls.filter(url => {
          const fileName = url.split('/').pop() || '';
          return fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        }),
        attachments: fileUrls.map((url, index) => ({
          id: String(index),
          name: uploadedFiles[index]?.name || 'Unknown',
          size: uploadedFiles[index]?.size || 0,
          type: uploadedFiles[index]?.type || 'application/octet-stream',
          url
        })),
      };

      setPosts([newPost, ...posts]);
      setPostContent("");
      setPostCode("");
      setPostTitle("");
      setUploadedFiles([]);
      setIsCreatePostOpen(false);
      
      toast.success("🎉 Post created successfully!");
    } catch (error) {
      toast.error("❌ Failed to create post. Please try again.");
    }
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
    <Tooltip.Provider>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Create Post Trigger */}
        <div className="bg-zinc-900/80 border rounded-xl p-4 feed-card neon-border-light">
          <div className="flex gap-3">
            <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Avatar.Image src={mockPosts[0].author.avatar} />
              <Avatar.Fallback className="bg-zinc-700">
                {mockPosts[0].author.username[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex-1 text-left px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition text-zinc-400 neon-button-light"
            >
              Share your latest hack, discovery, or thoughts...
            </button>
          </div>
        </div>

        {/* Create Post Dialog */}
        <Dialog.Root open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-zinc-900 border rounded-xl shadow-2xl z-50 neon-border-light overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
                      <Avatar.Image src={mockPosts[0].author.avatar} />
                      <Avatar.Fallback className="bg-zinc-700">
                        {mockPosts[0].author.username[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <div className="font-semibold text-zinc-100 neon-text-light">
                        {mockPosts[0].author.fullName}
                      </div>
                      <div className="text-xs text-zinc-500">
                        @{mockPosts[0].author.username}
                      </div>
                    </div>
                  </div>
                  <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-lg transition neon-button-light">
                    <X className="w-5 h-5 text-zinc-400" />
                  </Dialog.Close>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Title */}
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                  />

                  {/* Content */}
                  <textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full h-32 px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                  />

                  {/* Code Editor */}
                  <div className="border rounded-lg overflow-hidden neon-border-light">
                    <div className="bg-zinc-800/50 px-3 py-2 border-b flex items-center gap-2 neon-border-light">
                      <Code2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-zinc-300">Code (optional)</span>
                    </div>
                    <CodeEditor
                      value={postCode}
                      onChange={setPostCode}
                    />
                  </div>

                  {/* File Upload Area */}
                  {uploadedFiles.length > 0 && (
                    <div className="border rounded-lg p-3 neon-border-light">
                      <div className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attached Files ({uploadedFiles.length})
                      </div>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="text-green-400">
                                {file.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> :
                                 file.type.startsWith('video/') ? <Video className="w-4 h-4" /> :
                                 file.type.startsWith('audio/') ? <Music className="w-4 h-4" /> :
                                 file.type.includes('pdf') ? <FileText className="w-4 h-4" /> :
                                 <File className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm text-zinc-200 truncate">
                                  {file.name}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.md,.js,.ts,.py,.cpp,.c,.java,.html,.css,.json,.xml,.zip,.rar,.tar,.gz"
                  />
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t neon-border-light">
                  <div className="flex gap-2">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={handleFileSelect}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light"
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Attach Files
                      </Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light">
                          <ImageIcon className="w-5 h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Image
                      </Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light">
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Link
                      </Tooltip.Content>
                    </Tooltip.Root>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light">
                          <Code2 className="w-5 h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Code
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog.Close className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition">
                      Cancel
                    </Dialog.Close>
                    <button
                      onClick={handleCreatePost}
                      disabled={(!postContent.trim() && !postCode.trim() && uploadedFiles.length === 0) || isUploading}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition neon-button-light flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post
                        </>
                      )}
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
          const isCommentsExpanded = expandedComments.has(post.id);
          const currentReaction = postReactions[post.id];
          const views = viewCounts[post.id] || Math.floor(Math.random() * 100) + 50;

          return (
            <article
              key={post.id}
              className="bg-zinc-900/80 border rounded-xl p-4 feed-card neon-border-light"
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
                      <span className="font-semibold text-sm text-zinc-100 neon-text-light">
                        {post.author.fullName}
                      </span>
                      <span className="text-xs text-zinc-500">
                        @{post.author.username}
                      </span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500">
                        {formatTime(post.timestamp)}
                      </span>
                      {post.author.badges?.includes("Elite") && (
                        <Award className="w-3 h-3 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{post.author.bio}</p>
                  </div>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-1 hover:bg-zinc-800 rounded-lg transition neon-button-light">
                      <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="w-48 bg-zinc-900 border rounded-lg shadow-xl p-1 z-50 neon-border-light">
                      <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light">
                        🚨 Report
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light">
                        🙈 Hide
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light">
                        📌 Pin
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        className="px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded cursor-pointer outline-none flex items-center gap-2"
                        onClick={() => setDeleteConfirmOpen(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Post
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>

              {/* Post Title */}
              {(post as any).title && (
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 neon-text-light">
                  {(post as any).title}
                </h3>
              )}

              {/* Post Content */}
              <div className="text-zinc-300 text-sm leading-relaxed mb-3">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border neon-border-light neon-text-light"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Code Snippet */}
              {(post as any).codeSnippet && (
                <div className="mb-3 border rounded-lg overflow-hidden neon-border-light">
                  <div className="bg-zinc-800/50 px-3 py-2 border-b flex items-center gap-2 neon-border-light">
                    <Code2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-zinc-300">Code</span>
                  </div>
                  <pre className="p-3 text-sm text-zinc-300 bg-zinc-900/50 overflow-x-auto">
                    <code>{(post as any).codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className={`mb-3 ${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-2'}`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden border neon-border-light">
                      <img 
                        src={image} 
                        alt={`Post image ${index + 1}`} 
                        className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                        onClick={() => window.open(image, '_blank')}
                        onError={(e) => {
                          console.log('Image load error:', image);
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzczNzM3Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KICA8L3N2Zz4K';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* File Attachments */}
              {(post as any).attachments && (post as any).attachments.length > 0 && (
                <div className="border rounded-lg p-3 mb-3 neon-border-light">
                  <div className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    📎 Attachments ({(post as any).attachments.length})
                  </div>
                  <div className="space-y-2">
                    {(post as any).attachments.map((attachment: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-2 hover:bg-zinc-800 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-green-400">
                            {attachment.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> :
                             attachment.type.startsWith('video/') ? <Video className="w-4 h-4" /> :
                             attachment.type.startsWith('audio/') ? <Music className="w-4 h-4" /> :
                             attachment.type.includes('pdf') ? <FileText className="w-4 h-4" /> :
                             <File className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm text-zinc-200 truncate">
                              {attachment.name}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {formatFileSize(attachment.size)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              window.open(attachment.url, '_blank');
                              toast.success("📥 Opening file...");
                            }}
                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between py-2 border-t border-b mb-3 neon-border-light">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {post.likes} likes
                  </span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition neon-button-light ${
                      isLiked
                        ? "bg-red-900/20 text-red-400"
                        : "hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    Like
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition neon-button-light"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {isCommentsExpanded ? "Hide comments" : "Show comments"}
                  </button>

                  <DropdownMenu.Root open={shareDialogOpen === post.id} onOpenChange={(open) => setShareDialogOpen(open ? post.id : null)}>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800 text-zinc-400 hover:text-green-400 transition neon-button-light">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="w-48 bg-zinc-900 border rounded-lg shadow-xl p-2 z-50 neon-border-light">
                        <DropdownMenu.Item 
                          className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("🔗 Link copied to clipboard!");
                          }}
                        >
                          <Copy className="w-4 h-4 inline mr-2" />
                          Copy Link
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light">
                          📱 Share to Twitter
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light">
                          💼 Share to LinkedIn
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                <button
                  onClick={() => handleSave(post.id)}
                  className={`p-2 rounded-lg transition neon-button-light ${
                    isSaved
                      ? "bg-green-900/20 text-green-400"
                      : "hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t neon-border-light">
                <span className="text-xs text-zinc-500 mr-2">Quick reactions:</span>
                {["👍", "❤️", "😂", "😮", "👏", "🚀"].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(post.id, emoji)}
                    className={`p-1 hover:bg-zinc-800 rounded transition neon-button-light ${
                      currentReaction === emoji ? "bg-zinc-800 scale-110" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Comments Section */}
              {isCommentsExpanded && (
                <div className="mt-4 pt-4 border-t space-y-3 neon-border-light">
                  <div className="flex gap-3">
                    <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Avatar.Image src={mockPosts[0].author.avatar} />
                      <Avatar.Fallback className="bg-zinc-700 text-xs">
                        {mockPosts[0].author.username[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentTexts[post.id] || ""}
                        onChange={(e) =>
                          setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(post.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition neon-button-light"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {/* Delete Confirmation Dialog */}
        <Dialog.Root open={deleteConfirmOpen !== null} onOpenChange={(open) => !open && setDeleteConfirmOpen(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border rounded-xl shadow-2xl z-50 neon-border-light p-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 neon-text-light">
                  Delete Post
                </h3>
                <p className="text-zinc-400 mb-6">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setDeleteConfirmOpen(null)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteConfirmOpen && handleDeletePost(deleteConfirmOpen)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </Tooltip.Provider>
  );
}