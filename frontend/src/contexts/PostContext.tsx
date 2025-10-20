import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  Code,
  Image as ImageIcon,
  Paperclip,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { supabase, updateSupabaseAuth } from "../lib/supabase"; // Import Supabase client and the auth updater
import { v4 as uuidv4 } from 'uuid'; // For unique file names

// Define the shape of the context
interface PostContextType {
  openCreatePost: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

// The provider component
export function PostProvider({ children }: { children: ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openCreatePost = () => setIsDialogOpen(true);
  const closeCreatePost = () => setIsDialogOpen(false);

  return (
    <PostContext.Provider value={{ openCreatePost }}>
      {children}
      <CreatePostDialog isOpen={isDialogOpen} onClose={closeCreatePost} />
    </PostContext.Provider>
  );
}

// Custom hook to use the post context
export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
}

// The Dialog component for creating a post
function CreatePostDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCode("");
    setLanguage("plaintext");
    setLinkUrl("");
    setImageFile(null);
    setAttachmentFile(null);
    setShowCodeEditor(false);
  };

  const handlePost = async () => {
    if (!content && !code && !imageFile && !attachmentFile) {
        toast.error("Cannot create an empty post.");
        return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting post...");

    try {
      // Authenticate the Supabase client with the user's token from FastAPI
      updateSupabaseAuth();

      let imageUrl: string | undefined = undefined;
      let attachmentUrl: string | undefined = undefined;

      // 1. Upload image if it exists
      if (imageFile) {
        const fileName = `public/${uuidv4()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from('post_media')
          .upload(fileName, imageFile);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('post_media')
          .getPublicUrl(data.path);
        imageUrl = publicUrl;
      }

      // 2. Upload attachment if it exists
      if (attachmentFile) {
        const fileName = `public/${uuidv4()}-${attachmentFile.name}`;
        const { data, error } = await supabase.storage
          .from('post_media')
          .upload(fileName, attachmentFile);
        
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('post_media')
          .getPublicUrl(data.path);
        attachmentUrl = publicUrl;
      }

      // 3. Insert post data into the 'posts' table
      const { error: postError } = await supabase.from("posts").insert({
        title: title || null,
        content: content || null,
        code: code || null,
        language: code ? language : null,
        link_url: linkUrl || null,
        image_url: imageUrl,
        attachment_url: attachmentUrl,
        // user_id is handled by Supabase via RLS and the JWT
      });

      if (postError) throw postError;

      toast.success("Post created successfully!", { id: toastId });
      resetForm();
      onClose();
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error(`Failed to create post: ${error.message}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 z-50 max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-semibold text-zinc-100 mb-4">
            Create a New Post
          </Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100">
              <X />
            </button>
          </Dialog.Close>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500"
            />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 min-h-[120px]"
            />

            {showCodeEditor && (
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">Code Editor</h4>
                <textarea
                  placeholder="Your code snippet..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 font-mono text-sm min-h-[150px]"
                />
                <input
                  type="text"
                  placeholder="Language (e.g., python, javascript)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full mt-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 text-sm"
                />
              </div>
            )}

            {/* File Inputs */}
            <div className="text-sm text-zinc-400">
              {imageFile && <p>Image: {imageFile.name}</p>}
              {attachmentFile && <p>Attachment: {attachmentFile.name}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              <label className="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-lg cursor-pointer">
                <ImageIcon />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
              </label>
              <label className="p-2 text-zinc-400 hover:text-green-400 hover:bg-zinc-800 rounded-lg cursor-pointer">
                <Paperclip />
                <input type="file" className="hidden" onChange={(e) => e.target.files && setAttachmentFile(e.target.files[0])} />
              </label>
              <button onClick={() => setShowCodeEditor(!showCodeEditor)} className={`p-2 rounded-lg ${showCodeEditor ? 'bg-zinc-700 text-green-400' : 'text-zinc-400 hover:text-green-400 hover:bg-zinc-800'}`}>
                <Code />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100">Cancel</button>
              <button
                onClick={handlePost}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg disabled:bg-zinc-600"
              >
                <Send size={16} />
                Post
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
