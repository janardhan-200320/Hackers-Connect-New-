import { useState, useRef } from "react";
import { 
  Users, Search, Lock, Globe, MessageSquare, Plus, X, Send, 
  Image, Video, File, ArrowLeft, MoreVertical, Hash, Crown,
  Paperclip, Smile, Info, Flag, LogOut, Trash2, Settings,
  Pin, Palette, Shield, Star, Zap, Target, Code, Bug,
  Wifi, Terminal, Database, Server, Key, Eye, Fingerprint,
  AlertTriangle, HardDrive, Cpu, Network, Download, Upload,
  TrendingUp, Bell, Activity, Calendar, Clock, UserPlus,
  UserCheck, UserX, BarChart3, PieChart, LineChart, Share
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { mockGroups, mockUsers, Group, GroupMessage } from "@/lib/mockData";

// Enhanced Hacker-themed group icons with more variety
const hackerIcons = [
  { id: 'terminal', icon: Terminal, name: 'Terminal', category: 'Tools' },
  { id: 'code', icon: Code, name: 'Code', category: 'Development' },
  { id: 'bug', icon: Bug, name: 'Bug Hunter', category: 'Security' },
  { id: 'shield', icon: Shield, name: 'Cyber Shield', category: 'Security' },
  { id: 'key', icon: Key, name: 'Encryption', category: 'Crypto' },
  { id: 'eye', icon: Eye, name: 'Surveillance', category: 'Recon' },
  { id: 'fingerprint', icon: Fingerprint, name: 'Biometric', category: 'Auth' },
  { id: 'wifi', icon: Wifi, name: 'Network Pwn', category: 'Network' },
  { id: 'database', icon: Database, name: 'DB Exploit', category: 'Data' },
  { id: 'server', icon: Server, name: 'Server Hack', category: 'Infrastructure' },
  { id: 'cpu', icon: Cpu, name: 'Hardware', category: 'Hardware' },
  { id: 'harddrive', icon: HardDrive, name: 'Data Mining', category: 'Storage' },
  { id: 'network', icon: Network, name: 'Net Infra', category: 'Network' },
  { id: 'target', icon: Target, name: 'Pen Testing', category: 'Testing' },
  { id: 'zap', icon: Zap, name: 'Zero Day', category: 'Exploits' },
  { id: 'star', icon: Star, name: 'Elite Crew', category: 'Community' },
  { id: 'alert', icon: AlertTriangle, name: 'Threat Intel', category: 'Intel' },
  { id: 'download', icon: Download, name: 'Payload Drop', category: 'Exploits' },
  { id: 'upload', icon: Upload, name: 'Data Exfil', category: 'Exfiltration' },
  { id: 'users', icon: Users, name: 'Hacker Collective', category: 'Community' }
];

// Emojis for chat
const emojiList = [
  '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
  '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛',
  '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
  '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩',
  '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵',
  '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫',
  '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏',
  '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶'
];

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set(["1", "2"]));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  
  // Create group form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<string>('users');
  
  // Chat state
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "posts" | "members">("chat");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"general" | "members" | "profile" | "analytics" | "notifications">("general");
  
  // Group settings state
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupIsPrivate, setEditGroupIsPrivate] = useState(false);
  const [editGroupIcon, setEditGroupIcon] = useState("");
  const [inviteUsername, setInviteUsername] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedInviteUsers, setSelectedInviteUsers] = useState<string[]>([]);
  const [groupTheme, setGroupTheme] = useState("default");
  const [isSaving, setIsSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    mentions: true,
    joins: true,
    posts: true
  });
  
  // File refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "joined")
      return matchesSearch && joinedGroups.has(group.id);
    if (selectedTab === "private") return matchesSearch && group.isPrivate;
    return matchesSearch;
  });

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(memberSearch.toLowerCase()) &&
    !selectedMembers.includes(user.username)
  );

  const addMember = (username: string) => {
    if (!selectedMembers.includes(username)) {
      setSelectedMembers([...selectedMembers, username]);
      setMemberSearch("");
    }
  };

  const removeSelectedMember = (username: string) => {
    setSelectedMembers(selectedMembers.filter(u => u !== username));
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    
    const selectedIconData = hackerIcons.find(icon => icon.id === selectedIcon);
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      description: newGroupDescription,
      memberCount: selectedMembers.length + 1,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${selectedIcon}`,
      isPrivate: newGroupIsPrivate,
      posts: 0,
      members: ["0xRaven", ...selectedMembers], // Current user + selected members
      admins: ["0xRaven"],
      createdBy: "0xRaven",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messages: [
        {
          id: "welcome",
          senderId: "system",
          senderUsername: "System",
          content: `Welcome to ${newGroupName}! Start chatting and sharing ideas.`,
          timestamp: new Date().toISOString(),
          type: "text"
        }
      ],
      groupPosts: []
    };
    
    setGroups([newGroup, ...groups]);
    setJoinedGroups(new Set([...joinedGroups, newGroup.id]));
    
    // Reset form
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupIsPrivate(false);
    setSelectedMembers([]);
    setSelectedIcon('users');
    setCreateDialogOpen(false);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedGroup) return;
    
    // Simulate image upload
    const message: GroupMessage = {
      id: Date.now().toString(),
      senderId: "1",
      senderUsername: "0xRaven",
      content: `📷 ${file.name}`,
      timestamp: new Date().toISOString(),
      type: "image",
      mediaUrl: URL.createObjectURL(file)
    };

    const updatedGroup = {
      ...selectedGroup,
      messages: [...selectedGroup.messages, message],
      lastActivity: new Date().toISOString()
    };

    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    
    // Reset input
    if (event.target) event.target.value = '';
  };

  const handleGroupAction = (action: 'report' | 'leave' | 'delete' | 'settings') => {
    if (!selectedGroup) {
      console.error("No group selected for action:", action);
      return;
    }
    
    switch (action) {
      case 'report':
        alert(`Reported group "${selectedGroup.name}" for inappropriate content.`);
        break;
      case 'leave':
        setJoinedGroups(new Set([...joinedGroups].filter(id => id !== selectedGroup.id)));
        setSelectedGroup(null);
        alert(`Left group "${selectedGroup.name}".`);
        break;
      case 'delete':
        if (selectedGroup.admins.includes("0xRaven")) {
          setGroups(groups.filter(g => g.id !== selectedGroup.id));
          setJoinedGroups(new Set([...joinedGroups].filter(id => id !== selectedGroup.id)));
          setSelectedGroup(null);
          alert(`Deleted group "${selectedGroup.name}".`);
        } else {
          alert("Only admins can delete the group.");
        }
        break;
      case 'settings':
        console.log("Opening settings for group:", selectedGroup.name);
        // Initialize all edit states with current group values
        setEditGroupName(selectedGroup.name);
        setEditGroupDescription(selectedGroup.description);
        setEditGroupIsPrivate(selectedGroup.isPrivate);
        setEditGroupIcon(selectedGroup.avatar.split('seed=')[1] || 'users');
        
        // Reset to general tab and open modal immediately
        setSettingsTab("general");
        
        // Force the modal to open
        setTimeout(() => {
          setShowGroupSettings(true);
        }, 0);
        break;
    }
  };

  const saveGroupSettings = async () => {
    if (!selectedGroup) {
      alert("No group selected to save changes.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving changes for group:", selectedGroup.name);
      console.log("Current changes:", {
        name: editGroupName,
        description: editGroupDescription,
        isPrivate: editGroupIsPrivate,
        icon: editGroupIcon,
        notifications: notificationSettings
      });
      
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create updated group with all current changes
      const updatedGroup = {
        ...selectedGroup,
        name: editGroupName.trim() || selectedGroup.name,
        description: editGroupDescription.trim() || selectedGroup.description,
        isPrivate: editGroupIsPrivate,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${editGroupIcon}`,
        // Keep any member changes that were made during the session
        memberCount: selectedGroup.memberCount,
        members: selectedGroup.members,
        admins: selectedGroup.admins,
        messages: selectedGroup.messages,
        groupPosts: selectedGroup.groupPosts,
        lastActivity: new Date().toISOString(),
        // Save notification settings (could be used for future features)
        notificationSettings: notificationSettings
      };
      
      // Update the groups array and selected group
      setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
      setSelectedGroup(updatedGroup);
      
      // Reset any temporary invite states
      setSelectedInviteUsers([]);
      setMemberSearchQuery("");
      setInviteUsername("");
      
      // Show detailed success message with changes
      const changes = [];
      if (editGroupName !== selectedGroup.name) changes.push(`Name: "${editGroupName}"`);
      if (editGroupDescription !== selectedGroup.description) changes.push("Description updated");
      if (editGroupIsPrivate !== selectedGroup.isPrivate) changes.push(`Privacy: ${editGroupIsPrivate ? 'Private' : 'Public'}`);
      if (editGroupIcon !== (selectedGroup.avatar.split('seed=')[1] || 'users')) changes.push("Icon updated");
      
      const changesList = changes.length > 0 ? `\n\nChanges applied:\n• ${changes.join('\n• ')}` : "";
      alert(`Group settings updated successfully!${changesList}`);
      
      console.log("Group updated successfully:", updatedGroup);
      
      // Close the settings modal after successful save
      setShowGroupSettings(false);
      
    } catch (error) {
      console.error("Error saving group settings:", error);
      alert("Failed to save group settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const inviteMember = () => {
    if (!inviteUsername.trim() || !selectedGroup) return;
    
    const user = mockUsers.find(u => u.username === inviteUsername);
    if (!user) {
      alert("User not found!");
      return;
    }
    
    if (selectedGroup.members.includes(inviteUsername)) {
      alert("User is already a member!");
      return;
    }
    
    const updatedGroup = {
      ...selectedGroup,
      members: [...selectedGroup.members, inviteUsername],
      memberCount: selectedGroup.memberCount + 1,
      messages: [
        ...selectedGroup.messages,
        {
          id: Date.now().toString(),
          senderId: "system",
          senderUsername: "System",
          content: `${inviteUsername} has joined the group! 🎉`,
          timestamp: new Date().toISOString(),
          type: "text" as const
        }
      ]
    };
    
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    setInviteUsername("");
    alert(`${inviteUsername} has been invited to the group!`);
  };

  const inviteMultipleMembers = () => {
    if (selectedInviteUsers.length === 0 || !selectedGroup) return;
    
    const newMembers = selectedInviteUsers.filter(username => !selectedGroup.members.includes(username));
    
    if (newMembers.length === 0) {
      alert("All selected users are already members!");
      return;
    }
    
    const updatedGroup = {
      ...selectedGroup,
      members: [...selectedGroup.members, ...newMembers],
      memberCount: selectedGroup.memberCount + newMembers.length,
      messages: [
        ...selectedGroup.messages,
        {
          id: Date.now().toString(),
          senderId: "system",
          senderUsername: "System",
          content: `${newMembers.join(', ')} ${newMembers.length > 1 ? 'have' : 'has'} joined the group! 🎉`,
          timestamp: new Date().toISOString(),
          type: "text" as const
        }
      ]
    };
    
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    setSelectedInviteUsers([]);
    setMemberSearchQuery("");
    alert(`${newMembers.length} member(s) have been invited to the group!`);
  };

  const toggleUserSelection = (username: string) => {
    setSelectedInviteUsers(prev => 
      prev.includes(username) 
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };

  const filteredUsersForInvite = mockUsers.filter(user => 
    user.username.toLowerCase().includes(memberSearchQuery.toLowerCase()) &&
    selectedGroup?.members && !selectedGroup.members.includes(user.username)
  );

  const removeMember = (username: string) => {
    if (!selectedGroup || username === selectedGroup.createdBy) return;
    
    const updatedGroup = {
      ...selectedGroup,
      members: selectedGroup.members.filter(m => m !== username),
      admins: selectedGroup.admins.filter(a => a !== username),
      memberCount: selectedGroup.memberCount - 1
    };
    
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    alert(`${username} has been removed from the group.`);
  };

  const toggleAdmin = (username: string) => {
    if (!selectedGroup) return;
    
    const isAdmin = selectedGroup.admins.includes(username);
    const updatedGroup = {
      ...selectedGroup,
      admins: isAdmin 
        ? selectedGroup.admins.filter(a => a !== username)
        : [...selectedGroup.admins, username]
    };
    
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    alert(`${username} is now ${isAdmin ? 'no longer' : 'an'} admin.`);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;
    
    const message: GroupMessage = {
      id: Date.now().toString(),
      senderId: "1",
      senderUsername: "0xRaven",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text"
    };

    const updatedGroup = {
      ...selectedGroup,
      messages: [...selectedGroup.messages, message],
      lastActivity: new Date().toISOString()
    };

    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    setNewMessage("");
  };

  const handleMediaUpload = (type: 'image' | 'video' | 'file') => {
    // Simulate file upload
    if (!selectedGroup) return;
    
    const message: GroupMessage = {
      id: Date.now().toString(),
      senderId: "1",
      senderUsername: "0xRaven",
      content: type === 'image' ? "📷 Image" : type === 'video' ? "🎥 Video" : "📄 File",
      timestamp: new Date().toISOString(),
      type: type,
      mediaUrl: "https://example.com/placeholder",
      fileName: type === 'file' ? "document.pdf" : undefined
    };

    const updatedGroup = {
      ...selectedGroup,
      messages: [...selectedGroup.messages, message],
      lastActivity: new Date().toISOString()
    };

    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
  };

  const joinGroup = (groupId: string) => {
    setJoinedGroups(new Set([...joinedGroups, groupId]));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (selectedGroup) {
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Group Header */}
        <div className="bg-zinc-900 neon-border-light rounded-t-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedGroup(null)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <Avatar.Root className="w-10 h-10 rounded-lg overflow-hidden">
              <Avatar.Image src={selectedGroup.avatar} />
              <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-zinc-400" />
              </Avatar.Fallback>
            </Avatar.Root>
            
            <div>
              <h2 className="font-semibold text-zinc-100 flex items-center gap-2">
                {selectedGroup.name}
                {selectedGroup.isPrivate && <Lock className="w-3 h-3 text-zinc-500" />}
              </h2>
              <p className="text-xs text-zinc-500">
                {selectedGroup.memberCount} members • Last seen {formatTime(selectedGroup.lastActivity)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Info Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400">
                  <Info className="w-5 h-5" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-zinc-900 neon-border-light rounded-lg p-2 min-w-48 shadow-xl">
                  <DropdownMenu.Item 
                    onClick={() => handleGroupAction('report')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400 rounded cursor-pointer outline-none"
                  >
                    <Flag className="w-4 h-4" />
                    Report Group
                  </DropdownMenu.Item>
                  <DropdownMenu.Item 
                    onClick={() => handleGroupAction('leave')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-orange-400 rounded cursor-pointer outline-none"
                  >
                    <LogOut className="w-4 h-4" />
                    Leave Group
                  </DropdownMenu.Item>
                  {selectedGroup?.admins.includes("0xRaven") && (
                    <DropdownMenu.Item 
                      onClick={() => handleGroupAction('delete')}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-red-400 rounded cursor-pointer outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Group
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-zinc-900 border-x neon-border-light px-4">
          <div className="flex gap-6 border-b neon-border-light">
            {[
              { id: "chat", label: "Chat", icon: MessageSquare },
              { id: "posts", label: "Posts", icon: Hash },
              { id: "members", label: "Members", icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 ${
                  activeTab === tab.id 
                    ? "text-green-400 border-green-400" 
                    : "text-zinc-400 border-transparent hover:text-zinc-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-zinc-900 border-x neon-border-light overflow-hidden">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedGroup.messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Avatar.Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderUsername}`} />
                      <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center text-xs">
                        {message.senderUsername[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-green-400">
                          {message.senderUsername}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      <div className="bg-zinc-800 neon-border-light rounded-lg p-3 max-w-md">
                        {message.type === "text" && (
                          <p className="text-sm text-zinc-200">{message.content}</p>
                        )}
                        {message.type === "image" && (
                          <div className="space-y-2">
                            <p className="text-sm text-zinc-200">{message.content}</p>
                            {message.mediaUrl ? (
                              <img 
                                src={message.mediaUrl} 
                                alt="Shared image"
                                className="w-full max-w-xs h-auto rounded-lg border neon-border-light"
                              />
                            ) : (
                              <div className="w-32 h-20 bg-zinc-700 rounded flex items-center justify-center">
                                <Image className="w-6 h-6 text-zinc-500" />
                              </div>
                            )}
                          </div>
                        )}
                        {message.type === "video" && (
                          <div className="space-y-2">
                            <p className="text-sm text-zinc-200">{message.content}</p>
                            <div className="w-32 h-20 bg-zinc-700 rounded flex items-center justify-center">
                              <Video className="w-6 h-6 text-zinc-500" />
                            </div>
                          </div>
                        )}
                        {message.type === "file" && (
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-zinc-200">{message.fileName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t neon-border-light">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mb-3 p-3 bg-zinc-800 neon-border-light rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-400">Select Emoji</span>
                      <button 
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-zinc-400 hover:text-zinc-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-10 gap-1 max-h-32 overflow-y-auto">
                      {emojiList.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => addEmoji(emoji)}
                          className="p-1 hover:bg-zinc-700 rounded text-lg transition"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 bg-zinc-800 neon-border-light rounded-lg p-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 hover:bg-zinc-700 rounded transition text-zinc-400 hover:text-green-400"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={() => handleMediaUpload('file')}
                  />
                  
                  <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="p-1 hover:bg-zinc-700 rounded transition text-zinc-400 hover:text-green-400"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
                  />
                  
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-zinc-700 rounded transition text-zinc-400 hover:text-green-400"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-1 hover:bg-zinc-700 rounded transition text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "posts" && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Group Posts</h3>
                <button className="px-3 py-1 neon-button-light text-green-400 rounded-lg text-sm">
                  <Plus className="w-4 h-4 inline mr-1" />
                  New Post
                </button>
              </div>
              
              {selectedGroup.groupPosts.length > 0 ? (
                <div className="space-y-4">
                  {selectedGroup.groupPosts.map((post) => (
                    <div key={post.id} className="bg-zinc-800 neon-border-light rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                          <Avatar.Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUsername}`} />
                          <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center text-xs">
                            {post.authorUsername[0]}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-400">{post.authorUsername}</span>
                            <span className="text-xs text-zinc-500">{formatTime(post.timestamp)}</span>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-zinc-700 rounded transition text-zinc-400">
                          <Pin className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-zinc-200 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-zinc-500">
                        <button className="flex items-center gap-1 hover:text-green-400 transition">
                          <Zap className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-400 transition">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <Hash className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No posts yet</p>
                  <p className="text-sm">Share something with the group!</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "members" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-100">Members ({selectedGroup.memberCount})</h3>
                <button 
                  onClick={() => {
                    setSettingsTab("members");
                    setShowGroupSettings(true);
                  }}
                  className="px-3 py-1 neon-button-light text-green-400 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Invite
                </button>
              </div>
              
              {selectedGroup.members.map((username) => {
                const user = mockUsers.find(u => u.username === username);
                const isAdmin = selectedGroup.admins.includes(username);
                const isCreator = selectedGroup.createdBy === username;
                
                return (
                  <div key={username} className="flex items-center gap-3 p-3 bg-zinc-800 neon-border-light rounded-lg">
                    <div className="relative">
                      <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
                        <Avatar.Image src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
                        <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center">
                          {username[0].toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      {isCreator && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-100">{username}</span>
                        {isCreator && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Creator</span>}
                        {isAdmin && !isCreator && <Crown className="w-3 h-3 text-green-400" />}
                      </div>
                      <p className="text-sm text-zinc-500">
                        {user?.bio || "Hacker"} • {user?.reputation || 0} rep
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full" title="Online"></div>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-2 hover:bg-zinc-700 rounded transition text-zinc-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-zinc-900 neon-border-light rounded-lg p-2 min-w-36 shadow-xl">
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-green-400 rounded cursor-pointer">
                              <MessageSquare className="w-4 h-4" />
                              Message
                            </DropdownMenu.Item>
                            {selectedGroup.admins.includes("0xRaven") && username !== "0xRaven" && (
                              <>
                                <DropdownMenu.Item 
                                  onClick={() => toggleAdmin(username)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-yellow-400 rounded cursor-pointer"
                                >
                                  <Shield className="w-4 h-4" />
                                  {isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </DropdownMenu.Item>
                                <DropdownMenu.Item 
                                  onClick={() => removeMember(username)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-red-400 rounded cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                  Remove
                                </DropdownMenu.Item>
                              </>
                            )}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Groups</h1>
          <p className="text-sm text-zinc-500">
            Connect with like-minded hackers
          </p>
        </div>
        <Dialog.Root open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="px-4 py-2 neon-button-light text-white rounded-lg transition">
              Create Group
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-zinc-800 neon-border-light rounded-lg flex items-center justify-center">
                  {(() => {
                    const IconComponent = hackerIcons.find(icon => icon.id === selectedIcon)?.icon || Users;
                    return <IconComponent className="w-4 h-4 text-green-400" />;
                  })()}
                </div>
                Create New Group
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Choose Group Icon</label>
                  <div className="grid grid-cols-10 gap-2 p-3 bg-zinc-800 neon-border-light rounded-lg max-h-32 overflow-y-auto">
                    {hackerIcons.map((iconData) => {
                      const IconComponent = iconData.icon;
                      return (
                        <button
                          key={iconData.id}
                          onClick={() => setSelectedIcon(iconData.id)}
                          className={`p-2 rounded-lg transition flex items-center justify-center ${
                            selectedIcon === iconData.id 
                              ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                              : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-green-400'
                          }`}
                          title={iconData.name}
                        >
                          <IconComponent className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                  <textarea
                    placeholder="What's this group about?"
                    rows={3}
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 resize-none outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newGroupIsPrivate}
                    onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                  />
                  <label htmlFor="private" className="text-sm text-zinc-300">
                    Make this group private (invite-only)
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Add Members</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search users by username..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg pl-10 pr-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  {memberSearch && (
                    <div className="mt-2 max-h-32 overflow-y-auto bg-zinc-800 neon-border-light rounded-lg">
                      {filteredUsers.slice(0, 5).map((user) => (
                        <button
                          key={user.id}
                          onClick={() => addMember(user.username)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-zinc-700 transition text-left"
                        >
                          <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                            <Avatar.Image src={user.avatar} />
                            <Avatar.Fallback className="bg-zinc-600 flex items-center justify-center text-xs">
                              {user.username[0]}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{user.username}</p>
                            <p className="text-xs text-zinc-500">{user.fullName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedMembers.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-zinc-400 mb-2">Selected members:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map((username) => (
                          <div
                            key={username}
                            className="flex items-center gap-2 bg-zinc-800 neon-border-light rounded-lg px-3 py-1"
                          >
                            <span className="text-sm text-green-400">{username}</span>
                            <button
                              onClick={() => removeSelectedMember(username)}
                              className="text-green-400 hover:text-zinc-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button 
                    onClick={createGroup}
                    disabled={!newGroupName.trim()}
                    className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="bg-zinc-900 neon-border-light rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 neon-border-light rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              All Groups
            </Tabs.Trigger>
            <Tabs.Trigger
              value="joined"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              Joined
            </Tabs.Trigger>
            <Tabs.Trigger
              value="private"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              Private
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => {
          const isJoined = joinedGroups.has(group.id);

          return (
            <div
              key={group.id}
              className="bg-zinc-900 neon-border-light hover:border-green-400 rounded-xl p-4 transition cursor-pointer group feed-card"
              onClick={() => isJoined && setSelectedGroup(group)}
            >
              <div className="flex gap-4">
                <Avatar.Root className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Avatar.Image src={group.avatar} />
                  <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center">
                    <Users className="w-6 h-6 text-zinc-400" />
                  </Avatar.Fallback>
                </Avatar.Root>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-100 group-hover:text-green-400 transition">
                          {group.name}
                        </h3>
                        {group.isPrivate ? (
                          <Lock className="w-3 h-3 text-zinc-500" />
                        ) : (
                          <Globe className="w-3 h-3 text-zinc-500" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {group.memberCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {group.posts}
                      </div>
                    </div>

                    {isJoined ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroup(group);
                        }}
                        className="px-3 py-1 text-xs neon-button-light text-green-400 rounded transition"
                      >
                        Open
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          joinGroup(group.id);
                        }}
                        className="px-3 py-1 text-xs neon-button-light text-white rounded transition"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No groups found</p>
        </div>
      )}
    </div>
  );
};
