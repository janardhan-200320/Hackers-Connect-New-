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
import { mockPosts, mockComments } from "@/lib/mockData";
import CodeEditor from "@/components/CodeEditor";
import { usePost } from "@/contexts/PostContext";
import { toast } from "sonner";

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts);
  const [comments, setComments] = useState(mockComments);
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
  const [attachmentsDialogOpen, setAttachmentsDialogOpen] = useState<string | null>(null);
  const [trendingPosts, setTrendingPosts] = useState<Set<string>>(new Set(["1", "3"])); // Mock trending posts
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | 'following' | 'bookmarked'>('all');
  const [unreadComments, setUnreadComments] = useState<Set<string>>(new Set());
  const [expandedReactions, setExpandedReactions] = useState<Set<string>>(new Set());
  const [postReactionCounts, setPostReactionCounts] = useState<Record<string, Record<string, number>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isCreatePostOpen, setIsCreatePostOpen } = usePost();

  // Post creation states
  const [postContent, setPostContent] = useState("");
  const [postCode, setPostCode] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postLinks, setPostLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get comments for a post
  const getCommentsForPost = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  // Function to sort and filter posts
  const getSortedAndFilteredPosts = () => {
    let filteredPosts = [...posts];
    
    // Apply filters
    if (filterBy === 'bookmarked') {
      filteredPosts = filteredPosts.filter(post => savedPosts.has(post.id));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filteredPosts.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        filteredPosts.sort((a, b) => {
          const aIsTrending = trendingPosts.has(a.id) ? 1 : 0;
          const bIsTrending = trendingPosts.has(b.id) ? 1 : 0;
          if (aIsTrending !== bIsTrending) return bIsTrending - aIsTrending;
          return b.likes - a.likes;
        });
        break;
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
    }
    
    return filteredPosts;
  };

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
    const currentReaction = postReactions[postId];
    
    // Update user's reaction
    setPostReactions(prev => ({
      ...prev,
      [postId]: prev[postId] === reaction ? "" : reaction
    }));

    // Update reaction counts
    setPostReactionCounts(prev => {
      const postCounts = prev[postId] ? { ...prev[postId] } : {};
      
      // Remove old reaction count
      if (currentReaction) {
        postCounts[currentReaction] = Math.max(0, (postCounts[currentReaction] || 0) - 1);
      }
      
      // Add new reaction count
      if (currentReaction !== reaction) {
        postCounts[reaction] = (postCounts[reaction] || 0) + 1;
      }
      
      // Clean up zero counts
      Object.keys(postCounts).forEach(key => {
        if (postCounts[key] === 0) delete postCounts[key];
      });
      
      return {
        ...prev,
        [postId]: postCounts
      };
    });

    // Show toast feedback
    if (currentReaction === reaction) {
      toast.info(`Removed ${reaction} reaction`);
    } else {
      toast.success(`Reacted with ${reaction}`);
    }
  };

  const toggleReactionExpansion = (postId: string) => {
    setExpandedReactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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

    const newComment = {
      id: String(comments.length + 1),
      postId: postId,
      author: mockPosts[0].author, // Current user
      content: comment,
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    setComments(prev => [...prev, newComment]);
    toast.success("💬 Comment added!");
    setCommentTexts(prev => ({ ...prev, [postId]: "" }));
  };

  // Enhanced image handling
  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  // Convert file to data URL for better persistence
  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not a valid image file.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`"${file.name}" is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setSelectedImages(prev => [...prev, ...validImages]);
    
    // Create data URLs for better persistence
    const dataUrls = await Promise.all(validImages.map(file => fileToDataURL(file)));
    setImagePreviewUrls(prev => [...prev, ...dataUrls]);
    
    validImages.forEach(file => {
      toast.success(`📷 Added "${file.name}" to your post`);
    });

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const removedImage = selectedImages[index];
    const removedUrl = imagePreviewUrls[index];
    
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Only revoke URL if it's a blob URL (not a data URL)
    if (removedUrl && removedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(removedUrl);
    }
    
    toast.info(`🗑️ Removed "${removedImage.name}"`);
  };

  // Enhanced link handling
  const handleAddLink = () => {
    const url = linkInput.trim();
    if (!url) return;

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Add https:// if protocol is missing
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    if (postLinks.includes(formattedUrl)) {
      toast.error("This link has already been added");
      return;
    }

    setPostLinks(prev => [...prev, formattedUrl]);
    setLinkInput("");
    toast.success("🔗 Link added to your post");
  };

  const removeLink = (index: number) => {
    const removedLink = postLinks[index];
    setPostLinks(prev => prev.filter((_, i) => i !== index));
    toast.info(`🗑️ Removed link: ${removedLink.substring(0, 50)}...`);
  };

  // Code editor toggle
  const toggleCodeEditor = () => {
    setShowCodeEditor(!showCodeEditor);
    if (!showCodeEditor) {
      toast.info("💻 Code editor opened");
    }
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
    if (!postContent.trim() && !postCode.trim() && uploadedFiles.length === 0 && selectedImages.length === 0 && postLinks.length === 0) {
      toast.error("Please add some content, code, images, or links to your post");
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

      // For images, we'll use the preview URLs we already created
      // In a real app, you'd upload these to a server, but for demo we'll use the blob URLs
      const imageUrls = imagePreviewUrls.slice(); // Copy the preview URLs

      if (selectedImages.length > 0) {
        toast.success("✅ Images added to post!");
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
        images: imageUrls, // Use the actual blob URLs for display
        links: postLinks,
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
      setPostLinks([]);
      setLinkInput("");
      setShowLinkInput(false);
      setShowCodeEditor(false);
      setUploadedFiles([]);
      setSelectedImages([]);
      // Don't revoke URLs here since we're using them in the post
      setImagePreviewUrls([]);
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
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-3 sm:space-y-4">
        {/* Create Post Trigger */}
        <div className="bg-zinc-900/80 border rounded-xl p-3 sm:p-4 feed-card neon-border-light">
          <div className="flex gap-2 sm:gap-3">
            <Avatar.Root className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
              <Avatar.Image src={mockPosts[0].author.avatar} />
              <Avatar.Fallback className="bg-zinc-700 text-xs sm:text-sm">
                {mockPosts[0].author.username[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <button
              onClick={() => setIsCreatePostOpen(true)}
              className="flex-1 text-left px-3 sm:px-4 py-2 sm:py-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg transition text-zinc-400 text-sm sm:text-base neon-button-light"
            >
              <span className="hidden sm:inline">Share your latest hack, discovery, or thoughts...</span>
              <span className="sm:hidden">What's on your mind?</span>
            </button>
          </div>
        </div>

        {/* Create Post Dialog */}
        <Dialog.Root open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-full max-w-2xl max-h-[90vh] bg-zinc-900 border rounded-xl shadow-2xl z-50 neon-border-light overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar.Root className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Avatar.Image src={mockPosts[0].author.avatar} />
                      <Avatar.Fallback className="bg-zinc-700 text-xs sm:text-sm">
                        {mockPosts[0].author.username[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-zinc-100 neon-text-light text-sm sm:text-base truncate">
                        {mockPosts[0].author.fullName}
                      </div>
                      <div className="text-xs text-zinc-500 truncate">
                        @{mockPosts[0].author.username}
                      </div>
                    </div>
                  </div>
                  <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-lg transition neon-button-light">
                    <X className="w-5 h-5 text-zinc-400" />
                  </Dialog.Close>
                </div>

                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                  {/* Title */}
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                  />

                  {/* Content */}
                  <textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full h-24 sm:h-32 px-3 py-2 text-sm sm:text-base bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                  />

                  {/* Dynamic Code Editor */}
                  {showCodeEditor && (
                    <div className="border rounded-lg overflow-hidden neon-border-light animate-in slide-in-from-top duration-300">
                      <div className="bg-zinc-800/50 px-3 py-2 border-b flex items-center justify-between neon-border-light">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-zinc-300">Code Editor</span>
                        </div>
                        <button
                          onClick={() => setShowCodeEditor(false)}
                          className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <CodeEditor
                        value={postCode}
                        onChange={setPostCode}
                      />
                    </div>
                  )}

                  {/* Dynamic Link Input */}
                  {showLinkInput && (
                    <div className="border rounded-lg p-3 neon-border-light animate-in slide-in-from-top duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-zinc-300">Add Link</span>
                        </div>
                        <button
                          onClick={() => setShowLinkInput(false)}
                          className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={linkInput}
                          onChange={(e) => setLinkInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 neon-border-light"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddLink();
                            }
                          }}
                        />
                        <button
                          onClick={handleAddLink}
                          disabled={!linkInput.trim()}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Added Links Display */}
                  {postLinks.length > 0 && (
                    <div className="border rounded-lg p-3 neon-border-light">
                      <div className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-blue-400" />
                        Added Links ({postLinks.length})
                      </div>
                      <div className="space-y-2">
                        {postLinks.map((link, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <LinkIcon className="w-4 h-4 text-blue-400" />
                              <div className="min-w-0">
                                <div className="text-sm text-zinc-200 truncate">
                                  {link}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  Link preview will be generated
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeLink(index)}
                              className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="border rounded-lg p-3 neon-border-light">
                      <div className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-green-400" />
                        Selected Images ({selectedImages.length})
                      </div>
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 sm:h-24 object-cover rounded-lg border neon-border-light"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2 h-2 sm:w-3 sm:h-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded truncate max-w-[80%]">
                              {selectedImages[index]?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                  
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    multiple
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t neon-border-light">
                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={handleFileSelect}
                          className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light"
                        >
                          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Attach Files
                      </Tooltip.Content>
                    </Tooltip.Root>
                    
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={handleImageSelect}
                          className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400 neon-button-light"
                        >
                          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Images
                      </Tooltip.Content>
                    </Tooltip.Root>
                    
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() => setShowLinkInput(!showLinkInput)}
                          className={`p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition neon-button-light ${
                            showLinkInput ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-blue-400'
                          }`}
                        >
                          <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Link
                      </Tooltip.Content>
                    </Tooltip.Root>
                    
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={toggleCodeEditor}
                          className={`p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition neon-button-light ${
                            showCodeEditor ? 'bg-green-600 text-white' : 'text-zinc-400 hover:text-green-400'
                          }`}
                        >
                          <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        Add Code
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog.Close className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-zinc-400 hover:text-zinc-300 transition">
                      Cancel
                    </Dialog.Close>
                    <button
                      onClick={handleCreatePost}
                      disabled={(!postContent.trim() && !postCode.trim() && uploadedFiles.length === 0 && selectedImages.length === 0 && postLinks.length === 0) || isUploading}
                      className="px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-xs sm:text-sm font-medium transition neon-button-light flex items-center gap-2"
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

        {/* Filter and Sort Section */}
        <div className="bg-zinc-900/50 border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 feed-card neon-border-light">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <h3 className="text-xs sm:text-sm font-medium text-zinc-300 neon-text-light">Sort:</h3>
              <div className="flex gap-1 sm:gap-2">
                {(['newest', 'popular', 'trending'] as const).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition neon-button-light ${
                      sortBy === sort 
                        ? 'bg-green-600 text-white' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-green-400'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {sort === 'newest' && '🕒'} {sort === 'popular' && '🔥'} {sort === 'trending' && '📈'}
                      {' '}
                    </span>
                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <h3 className="text-xs sm:text-sm font-medium text-zinc-300 neon-text-light">Filter:</h3>
              <div className="flex gap-1 sm:gap-2">
                {(['all', 'bookmarked'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition neon-button-light ${
                      filterBy === filter 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-blue-400'
                    }`}
                  >
                    <span className="hidden sm:inline">
                      {filter === 'all' && '📋'} {filter === 'bookmarked' && '📚'}
                      {' '}
                    </span>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {getSortedAndFilteredPosts().map((post) => {
          const isLiked = likedPosts.has(post.id);
          const isSaved = savedPosts.has(post.id);
          const isCommentsExpanded = expandedComments.has(post.id);
          const currentReaction = postReactions[post.id];
          const views = viewCounts[post.id] || Math.floor(Math.random() * 100) + 50;

          return (
            <article
              key={post.id}
              className="bg-zinc-900/80 border rounded-xl p-3 sm:p-4 feed-card neon-border-light"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                  <Avatar.Root className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Avatar.Image src={post.author.avatar} />
                    <Avatar.Fallback className="bg-zinc-700 text-xs sm:text-sm">
                      {post.author.username[0]}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-zinc-100 neon-text-light truncate">
                        {post.author.fullName}
                      </span>
                      <span className="text-xs text-zinc-500 truncate">
                        @{post.author.username}
                      </span>
                      <span className="text-xs text-zinc-600 hidden sm:inline">•</span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        {formatTime(post.timestamp)}
                        {new Date(post.timestamp).getTime() > Date.now() - 300000 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="hidden xs:inline">LIVE</span>
                            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse xs:hidden"></div>
                          </span>
                        )}
                      </span>
                      {post.author.badges?.includes("Elite") && (
                        <Award className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      )}
                      {trendingPosts.has(post.id) && (
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-400/30">
                              <TrendingUp className="w-3 h-3 text-orange-400" />
                              <span className="text-xs text-orange-400 font-medium">HOT</span>
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                            This post is trending! 🔥
                          </Tooltip.Content>
                        </Tooltip.Root>
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
                      {(post as any).attachments && (post as any).attachments.length > 0 && (
                        <DropdownMenu.Item 
                          className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer outline-none neon-text-light flex items-center gap-2"
                          onClick={() => setAttachmentsDialogOpen(post.id)}
                        >
                          <Paperclip className="w-4 h-4" />
                          View Attachments ({(post as any).attachments.length})
                        </DropdownMenu.Item>
                      )}
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
                <h3 className="text-base sm:text-lg font-semibold text-zinc-100 mb-2 neon-text-light break-words">
                  {(post as any).title}
                </h3>
              )}

              {/* Post Content */}
              <div className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-3 break-words">
                {post.content}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
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

              {/* Enhanced Image Display */}
              {post.images && post.images.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-zinc-500 mb-2 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {post.images.length} image{post.images.length > 1 ? 's' : ''}
                  </div>
                  <div className={`${post.images.length === 1 ? 'max-w-md' : 'grid grid-cols-2 gap-2'}`}>
                    {post.images.map((image, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border neon-border-light bg-zinc-800/20">
                        <img 
                          src={image} 
                          alt={`Post image ${index + 1}`} 
                          className="w-full h-48 object-cover post-image cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                          onLoad={(e) => {
                            // Remove loading class when image loads
                            e.currentTarget.classList.remove('image-loading');
                            console.log('Image loaded successfully:', image);
                          }}
                          onLoadStart={(e) => {
                            // Add loading class when image starts loading
                            e.currentTarget.classList.add('image-loading');
                          }}
                          onError={(e) => {
                            e.currentTarget.classList.remove('image-loading');
                            console.log('Image load error:', image);
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDA0MDQwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+📷</dGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+CiAgPC9zdmc+';
                          }}
                        />
                        {/* Overlay with expand icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ExternalLink className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        {/* Image index indicator */}
                        {post.images.length > 1 && (
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}/{post.images.length}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Link Previews */}
              {(post as any).links && (post as any).links.length > 0 && (
                <div className="mb-3 space-y-2">
                  {(post as any).links.map((link: string, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-3 bg-zinc-800/30 hover:bg-zinc-800/50 transition cursor-pointer neon-border-light"
                      onClick={() => window.open(link, '_blank')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-zinc-200 truncate">
                            {link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Click to open link
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enhanced Code Display */}
              {(post as any).codeSnippet && (
                <div className="mb-3 border rounded-lg overflow-hidden neon-border-light">
                  <div className="bg-zinc-800/50 px-3 py-2 border-b flex items-center justify-between neon-border-light">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-zinc-300">Code</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText((post as any).codeSnippet);
                        toast.success("📋 Code copied to clipboard!");
                      }}
                      className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="p-3 text-sm text-zinc-300 bg-zinc-900/50 overflow-x-auto">
                    <code>{(post as any).codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Dynamic Code from Post */}
              {(post as any).code && (
                <div className="mb-3 border rounded-lg overflow-hidden neon-border-light">
                  <div className="bg-zinc-800/50 px-3 py-2 border-b flex items-center justify-between neon-border-light">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-zinc-300">Code</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText((post as any).code);
                        toast.success("📋 Code copied to clipboard!");
                      }}
                      className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="p-3 text-sm text-zinc-300 bg-zinc-900/50 overflow-x-auto">
                    <code>{(post as any).code}</code>
                  </pre>
                </div>
              )}

              {/* Enhanced Post Stats */}
              <div className="flex items-center justify-between py-2 border-t border-b mb-3 neon-border-light">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="flex items-center gap-1 hover:text-blue-400 transition cursor-help">
                        <Eye className="w-3 h-3" />
                        {views} views
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                      Post views in last 24h
                    </Tooltip.Content>
                  </Tooltip.Root>
                  
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="flex items-center gap-1 hover:text-red-400 transition cursor-help">
                        <TrendingUp className="w-3 h-3" />
                        {post.likes} likes
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                      Total likes on this post
                    </Tooltip.Content>
                  </Tooltip.Root>
                  
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span className="flex items-center gap-1 hover:text-blue-400 transition cursor-help">
                        <MessageCircle className="w-3 h-3" />
                        {getCommentsForPost(post.id).length} comments
                      </span>
                    </Tooltip.Trigger>
                    <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                      Comments on this post
                    </Tooltip.Content>
                  </Tooltip.Root>
                  
                  <span className="flex items-center gap-1 hover:text-green-400 transition cursor-help">
                    <Share2 className="w-3 h-3" />
                    {post.shares} shares
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Award className="w-3 h-3" />
                    {Math.floor(Math.random() * 100) + 20} pts
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">
                    {((getCommentsForPost(post.id).length + post.likes) / views * 100).toFixed(1)}% engagement
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition neon-button-light ${
                      isLiked
                        ? "bg-red-900/20 text-red-400"
                        : "hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                    }`}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span className="hidden xs:inline">Like</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleComments(post.id);
                      setUnreadComments(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(post.id);
                        return newSet;
                      });
                    }}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-zinc-800 text-zinc-400 hover:text-blue-400 transition neon-button-light relative"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">
                      {isCommentsExpanded ? "Hide" : `${getCommentsForPost(post.id).length}`}
                    </span>
                    <span className="xs:hidden">{getCommentsForPost(post.id).length}</span>
                    {unreadComments.has(post.id) && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </button>

                  <DropdownMenu.Root open={shareDialogOpen === post.id} onOpenChange={(open) => setShareDialogOpen(open ? post.id : null)}>
                    <DropdownMenu.Trigger asChild>
                      <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-zinc-800 text-zinc-400 hover:text-green-400 transition neon-button-light">
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Share</span>
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
                  className={`p-1.5 sm:p-2 rounded-lg transition neon-button-light ${
                    isSaved
                      ? "bg-green-900/20 text-green-400"
                      : "hover:bg-zinc-800 text-zinc-400 hover:text-green-400"
                  }`}
                >
                  <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Enhanced Reactions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t neon-border-light">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  {/* Show current reaction counts if any */}
                  {postReactionCounts[post.id] && Object.keys(postReactionCounts[post.id]).length > 0 && (
                    <div className="flex items-center gap-1 mr-2 sm:mr-3">
                      {Object.entries(postReactionCounts[post.id])
                        .filter(([, count]) => count > 0)
                        .slice(0, 3)
                        .map(([emoji, count]) => (
                          <div key={emoji} className="flex items-center gap-1 bg-zinc-800/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                            <span className="text-xs sm:text-sm">{emoji}</span>
                            <span className="text-zinc-400 text-xs">{count}</span>
                          </div>
                        ))}
                      {Object.keys(postReactionCounts[post.id]).length > 3 && (
                        <span className="text-xs text-zinc-500">+{Object.keys(postReactionCounts[post.id]).length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Single emoji button that expands */}
                  {!expandedReactions.has(post.id) ? (
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={() => toggleReactionExpansion(post.id)}
                          className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition transform hover:scale-110 neon-button-light"
                        >
                          <span className="text-sm sm:text-base">😊</span>
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                        React to this post
                      </Tooltip.Content>
                    </Tooltip.Root>
                  ) : (
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-800/30 p-1.5 sm:p-2 rounded-lg border neon-border-light flex-wrap">
                      <span className="text-xs text-zinc-500 mr-1 sm:mr-2 hidden xs:inline">React:</span>
                      {["👍", "❤️", "😂", "😮", "👏", "🚀", "🔥", "🎯", "🤔", "😍", "😭", "😱"].map((emoji) => (
                        <Tooltip.Root key={emoji}>
                          <Tooltip.Trigger asChild>
                            <button
                              onClick={() => {
                                handleReaction(post.id, emoji);
                                toggleReactionExpansion(post.id);
                              }}
                              className={`p-1 sm:p-1.5 hover:bg-zinc-700 rounded-lg transition transform hover:scale-125 ${
                                currentReaction === emoji ? "bg-zinc-700 scale-110 ring-2 ring-green-400" : ""
                              }`}
                            >
                              <span className="text-sm sm:text-base">{emoji}</span>
                            </button>
                          </Tooltip.Trigger>
                          <Tooltip.Content className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs">
                            {emoji === "👍" ? "Like" : 
                             emoji === "❤️" ? "Love" : 
                             emoji === "😂" ? "Funny" : 
                             emoji === "😮" ? "Wow" : 
                             emoji === "👏" ? "Applause" : 
                             emoji === "🚀" ? "Rocket" :
                             emoji === "🔥" ? "Fire" : 
                             emoji === "🎯" ? "Bullseye" :
                             emoji === "🤔" ? "Thinking" :
                             emoji === "😍" ? "Love it" :
                             emoji === "😭" ? "Sad" : "Shocked"}
                          </Tooltip.Content>
                        </Tooltip.Root>
                      ))}
                      <button
                        onClick={() => toggleReactionExpansion(post.id)}
                        className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400 transition ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              {isCommentsExpanded && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t space-y-3 sm:space-y-4 neon-border-light">
                  {/* Existing Comments */}
                  {getCommentsForPost(post.id).length > 0 && (
                    <div className="space-y-2 sm:space-y-3">
                      <h4 className="text-xs sm:text-sm font-medium text-zinc-300 flex items-center gap-2">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        Comments ({getCommentsForPost(post.id).length})
                      </h4>
                      {getCommentsForPost(post.id).map((comment) => (
                        <div key={comment.id} className="flex gap-2 sm:gap-3 bg-zinc-800/30 p-2 sm:p-3 rounded-lg neon-border-light">
                          <Avatar.Root className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Avatar.Image src={comment.author.avatar} />
                            <Avatar.Fallback className="bg-zinc-700 text-xs">
                              {comment.author.username[0]}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                              <span className="text-xs sm:text-sm font-medium text-zinc-200 neon-text-light truncate">
                                {comment.author.username}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {new Date(comment.timestamp).toLocaleTimeString()}
                              </span>
                              {/* Show if user has reacted to this post */}
                              {postReactions[post.id] && (
                                <div className="flex items-center gap-1 ml-auto">
                                  <span className="text-xs text-zinc-500">reacted</span>
                                  <span className="text-sm">{postReactions[post.id]}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed break-words">
                              {comment.content}
                            </p>
                            
                            {/* Show post reactions in comments if any exist */}
                            {postReactionCounts[post.id] && Object.keys(postReactionCounts[post.id]).length > 0 && 
                             comment.author.username === 'you' && (
                              <div className="mt-2 pt-2 border-t border-zinc-700/50">
                                <div className="text-xs text-zinc-500 mb-1">Post reactions:</div>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(postReactionCounts[post.id])
                                    .filter(([, count]) => count > 0)
                                    .map(([emoji, count]) => (
                                      <div key={emoji} className="flex items-center gap-1 bg-zinc-700/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
                                        <span className="text-xs">{emoji}</span>
                                        <span className="text-zinc-400 text-xs">{count}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 sm:gap-3 mt-2">
                              <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition neon-text-light">
                                <Heart className="w-3 h-3" />
                                <span className="hidden xs:inline">{comment.likes}</span>
                                <span className="xs:hidden">{comment.likes}</span>
                              </button>
                              <button className="text-xs text-zinc-500 hover:text-blue-400 transition neon-text-light">
                                <span className="hidden xs:inline">Reply</span>
                                <span className="xs:hidden">↩</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex gap-2 sm:gap-3 pt-3 border-t neon-border-light">
                    <Avatar.Root className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Avatar.Image src={mockPosts[0].author.avatar} />
                      <Avatar.Fallback className="bg-zinc-700 text-xs">
                        {mockPosts[0].author.username[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div className="flex-1 flex gap-1 sm:gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentTexts[post.id] || ""}
                        onChange={(e) =>
                          setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-zinc-800/50 border rounded-lg text-zinc-100 placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 neon-border-light"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(post.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-lg text-xs sm:text-sm font-medium transition neon-button-light"
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {/* Attachments Dialog */}
        <Dialog.Root open={attachmentsDialogOpen !== null} onOpenChange={(open) => !open && setAttachmentsDialogOpen(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-zinc-900 border rounded-xl shadow-2xl z-50 neon-border-light">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-zinc-100 neon-text-light flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-green-400" />
                    Attachments
                    {attachmentsDialogOpen && (
                      <span className="text-sm text-zinc-400">
                        ({(posts.find(p => p.id === attachmentsDialogOpen) as any)?.attachments?.length || 0})
                      </span>
                    )}
                  </h3>
                  <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-lg transition neon-button-light">
                    <X className="w-5 h-5 text-zinc-400" />
                  </Dialog.Close>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {attachmentsDialogOpen && (posts.find(p => p.id === attachmentsDialogOpen) as any)?.attachments?.map((attachment: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3 hover:bg-zinc-800 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-green-400">
                          {attachment.type.startsWith('image/') ? <ImageIcon className="w-5 h-5" /> :
                           attachment.type.startsWith('video/') ? <Video className="w-5 h-5" /> :
                           attachment.type.startsWith('audio/') ? <Music className="w-5 h-5" /> :
                           attachment.type.includes('pdf') ? <FileText className="w-5 h-5" /> :
                           <File className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-zinc-200 truncate">
                            {attachment.name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {formatFileSize(attachment.size)} • {attachment.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            window.open(attachment.url, '_blank');
                            toast.success("📥 Opening file...");
                          }}
                          className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition neon-button-light"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(attachment.url);
                            toast.success("🔗 File URL copied to clipboard!");
                          }}
                          className="p-2 hover:bg-zinc-700 rounded text-zinc-400 hover:text-green-400 transition neon-button-light"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-zinc-500">
                      <Paperclip className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
                      <p>No attachments found</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t neon-border-light">
                  <Dialog.Close className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition neon-button-light">
                    Close
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

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