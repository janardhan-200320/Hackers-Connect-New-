import { createContext, useContext, useState, ReactNode } from 'react';

interface PostContextType {
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  openCreatePost: () => void;
  closeCreatePost: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const openCreatePost = () => setIsCreatePostOpen(true);
  const closeCreatePost = () => setIsCreatePostOpen(false);

  return (
    <PostContext.Provider
      value={{
        isCreatePostOpen,
        setIsCreatePostOpen,
        openCreatePost,
        closeCreatePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
}
