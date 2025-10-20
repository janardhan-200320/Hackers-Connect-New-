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

// Group themes and colors
const groupThemes = [
  { id: 'default', name: 'Cyber Dark', description: 'Classic hacker aesthetic' },
  { id: 'matrix', name: 'Matrix Green', description: 'Green matrix vibes' },
  { id: 'neon', name: 'Neon Glow', description: 'Vibrant neon colors' },
  { id: 'stealth', name: 'Stealth Mode', description: 'Minimal dark theme' },
  { id: 'retro', name: 'Retro Terminal', description: '80s computer style' },
  { id: 'hologram', name: 'Hologram', description: 'Futuristic holographic' }
];

const groupColors = [
  '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4',
  '#84cc16', '#f97316', '#ec4899', '#6366f1', '#14b8a6', '#eab308'
];

const popularTags = [
  'CTF', 'Bug Bounty', 'Pentesting', 'Crypto', 'Web3', 'OSINT', 'Malware', 'Reversing',
  'Forensics', 'Social Engineering', 'Network Security', 'Mobile Security', 'IoT',
  'AI/ML Security', 'Cloud Security', 'DevSecOps', 'Red Team', 'Blue Team'
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
  
  // Invite members state
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedInviteUsers, setSelectedInviteUsers] = useState<string[]>([]);
  
  // Edit group state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupIsPrivate, setEditGroupIsPrivate] = useState(false);
  const [editGroupIcon, setEditGroupIcon] = useState<string>('users');
  
  // Enhanced edit group features
  const [editGroupTheme, setEditGroupTheme] = useState<string>('default');
  const [editGroupColor, setEditGroupColor] = useState<string>('#10b981');
  const [editGroupTags, setEditGroupTags] = useState<string[]>([]);
  const [editGroupTagInput, setEditGroupTagInput] = useState("");
  const [editGroupMemberLimit, setEditGroupMemberLimit] = useState<number>(0);
  const [editGroupAutoApprove, setEditGroupAutoApprove] = useState(true);
  const [editGroupAllowFileSharing, setEditGroupAllowFileSharing] = useState(true);
  const [editGroupAllowBots, setEditGroupAllowBots] = useState(false);
  
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

  // saveGroupSettings function removed

  // inviteMember function removed

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
    setInviteDialogOpen(false);
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

  const openEditDialog = () => {
    if (!selectedGroup) return;
    setEditGroupName(selectedGroup.name);
    setEditGroupDescription(selectedGroup.description);
    setEditGroupIsPrivate(selectedGroup.isPrivate);
    
    // Load existing values or defaults
    setEditGroupIcon((selectedGroup as any).icon || selectedIcon);
    setEditGroupTheme((selectedGroup as any).theme || 'default');
    setEditGroupColor((selectedGroup as any).color || '#10b981');
    setEditGroupTags((selectedGroup as any).tags || []);
    setEditGroupTagInput("");
    setEditGroupMemberLimit((selectedGroup as any).memberLimit || 0);
    setEditGroupAutoApprove((selectedGroup as any).autoApprove !== undefined ? (selectedGroup as any).autoApprove : true);
    setEditGroupAllowFileSharing((selectedGroup as any).allowFileSharing !== undefined ? (selectedGroup as any).allowFileSharing : true);
    setEditGroupAllowBots((selectedGroup as any).allowBots || false);
    
    setEditDialogOpen(true);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !editGroupTags.includes(tag.trim()) && editGroupTags.length < 5) {
      setEditGroupTags([...editGroupTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditGroupTags(editGroupTags.filter(tag => tag !== tagToRemove));
  };

  const saveGroupEdit = () => {
    if (!selectedGroup || !editGroupName.trim()) return;
    
    // Generate new avatar based on selected icon
    const newAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${editGroupIcon}`;
    
    const updatedGroup = {
      ...selectedGroup,
      name: editGroupName,
      description: editGroupDescription,
      isPrivate: editGroupIsPrivate,
      avatar: newAvatar, // Update avatar based on new icon
      // Add new features to group data
      icon: editGroupIcon,
      theme: editGroupTheme,
      color: editGroupColor,
      tags: editGroupTags,
      memberLimit: editGroupMemberLimit,
      autoApprove: editGroupAutoApprove,
      allowFileSharing: editGroupAllowFileSharing,
      allowBots: editGroupAllowBots
    };
    
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
    setEditDialogOpen(false);
    alert('Group settings updated successfully! 🎉');
  };

  const handleGroupAction = (action: 'report' | 'leave' | 'delete' | 'invite' | 'edit') => {
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
      case 'invite':
        setInviteDialogOpen(true);
        break;
      case 'edit':
        openEditDialog();
        break;
    }
  };

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
        <div 
          className="bg-zinc-900 neon-border-light rounded-t-xl p-4 flex items-center justify-between"
          style={{ 
            background: (selectedGroup as any).theme === 'matrix' ? 'linear-gradient(135deg, #0a0a0a 0%, #0f2027 100%)' :
                       (selectedGroup as any).theme === 'neon' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
                       (selectedGroup as any).theme === 'stealth' ? '#000000' :
                       (selectedGroup as any).theme === 'retro' ? 'linear-gradient(135deg, #2c1810 0%, #8b4513 100%)' :
                       (selectedGroup as any).theme === 'hologram' ? 'linear-gradient(135deg, #0a0a23 0%, #1e3a8a 100%)' : 
                       undefined,
            borderColor: (selectedGroup as any).color || '#10b981'
          }}
        >
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedGroup(null)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-green-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div 
              className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ 
                backgroundColor: (selectedGroup as any).color || '#10b981',
                border: `2px solid ${(selectedGroup as any).color || '#10b981'}40`
              }}
            >
              {(() => {
                const groupIcon = (selectedGroup as any).icon;
                const iconData = hackerIcons.find(icon => icon.id === groupIcon);
                if (iconData) {
                  const IconComponent = iconData.icon;
                  return <IconComponent className="w-5 h-5 text-white" />;
                }
                return <Users className="w-5 h-5 text-white" />;
              })()}
            </div>
            
            <div>
              <h2 className="font-semibold text-zinc-100 flex items-center gap-2">
                {selectedGroup.name}
                {selectedGroup.isPrivate && <Lock className="w-3 h-3 text-zinc-500" />}
                {(selectedGroup as any).tags && (selectedGroup as any).tags.length > 0 && (
                  <div className="flex gap-1 ml-2">
                    {(selectedGroup as any).tags.slice(0, 2).map((tag: string) => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: `${(selectedGroup as any).color || '#10b981'}80` }}
                      >
                        {tag}
                      </span>
                    ))}
                    {(selectedGroup as any).tags.length > 2 && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: `${(selectedGroup as any).color || '#10b981'}80` }}
                      >
                        +{(selectedGroup as any).tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </h2>
              <p className="text-xs text-zinc-500">
                {selectedGroup.memberCount} members
                {(selectedGroup as any).memberLimit > 0 && ` / ${(selectedGroup as any).memberLimit} max`}
                {` • Last seen ${formatTime(selectedGroup.lastActivity)}`}
                {(selectedGroup as any).theme && (selectedGroup as any).theme !== 'default' && (
                  <span className="ml-2 text-zinc-400">• {groupThemes.find(t => t.id === (selectedGroup as any).theme)?.name}</span>
                )}
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
                  {selectedGroup?.admins.includes("0xRaven") && (
                    <>
                      <DropdownMenu.Item 
                        onClick={() => handleGroupAction('invite')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-green-400 rounded cursor-pointer outline-none"
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite Members
                      </DropdownMenu.Item>
                      <DropdownMenu.Item 
                        onClick={() => handleGroupAction('edit')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-blue-400 rounded cursor-pointer outline-none"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Group
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-zinc-700 my-1" />
                    </>
                  )}
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
                {/* Invite button removed - settings functionality disabled */}
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

        {/* Invite Members Dialog - Group View */}
        <Dialog.Root open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-green-400" />
                Invite Members to {selectedGroup?.name}
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Search Users</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search users by username..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg pl-10 pr-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                
                {memberSearchQuery && (
                  <div className="max-h-48 overflow-y-auto bg-zinc-800 neon-border-light rounded-lg">
                    {filteredUsersForInvite.slice(0, 8).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-700 transition"
                      >
                        <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                          <Avatar.Image src={user.avatar} />
                          <Avatar.Fallback className="bg-zinc-600 flex items-center justify-center text-xs">
                            {user.username[0]}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-100">{user.username}</p>
                          <p className="text-xs text-zinc-500">{user.fullName}</p>
                        </div>
                        <button
                          onClick={() => toggleUserSelection(user.username)}
                          className={`px-3 py-1 text-xs rounded transition ${
                            selectedInviteUsers.includes(user.username)
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                          }`}
                        >
                          {selectedInviteUsers.includes(user.username) ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    ))}
                    {filteredUsersForInvite.length === 0 && (
                      <div className="p-3 text-center text-zinc-500 text-sm">
                        No users found
                      </div>
                    )}
                  </div>
                )}
                
                {selectedInviteUsers.length > 0 && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-2">Selected users ({selectedInviteUsers.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInviteUsers.map((username) => (
                        <div
                          key={username}
                          className="flex items-center gap-2 bg-zinc-800 neon-border-light rounded-lg px-3 py-1"
                        >
                          <span className="text-sm text-green-400">{username}</span>
                          <button
                            onClick={() => toggleUserSelection(username)}
                            className="text-green-400 hover:text-zinc-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Dialog.Close asChild>
                    <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button 
                    onClick={inviteMultipleMembers}
                    disabled={selectedInviteUsers.length === 0}
                    className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Invite {selectedInviteUsers.length > 0 ? `(${selectedInviteUsers.length})` : ''}
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Edit Group Dialog - Group View */}
        <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-400" />
                Edit Group Settings
              </Dialog.Title>
              
              <Tabs.Root defaultValue="basic" className="w-full">
                <Tabs.List className="grid w-full grid-cols-3 mb-6">
                  <Tabs.Trigger
                    value="basic"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Basic Info
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="appearance"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Appearance
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="advanced"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Advanced
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="basic" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Group Name</label>
                    <input
                      type="text"
                      placeholder="Enter group name"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                    <textarea
                      placeholder="What's this group about?"
                      rows={3}
                      value={editGroupDescription}
                      onChange={(e) => setEditGroupDescription(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 resize-none outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Group Tags (Max 5)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={editGroupTagInput}
                        onChange={(e) => setEditGroupTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(editGroupTagInput);
                            setEditGroupTagInput("");
                          }
                        }}
                        className="flex-1 bg-zinc-800 neon-border-light rounded-lg px-3 py-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => {
                          addTag(editGroupTagInput);
                          setEditGroupTagInput("");
                        }}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {popularTags.slice(0, 8).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => addTag(tag)}
                          className="px-2 py-1 text-xs bg-zinc-700 text-zinc-300 rounded hover:bg-zinc-600 transition"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    
                    {editGroupTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editGroupTags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-sm"
                          >
                            <span>{tag}</span>
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-400 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="editPrivateGroupView"
                      checked={editGroupIsPrivate}
                      onChange={(e) => setEditGroupIsPrivate(e.target.checked)}
                      className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                    />
                    <label htmlFor="editPrivateGroupView" className="text-sm text-zinc-300">
                      Make this group private (invite-only)
                    </label>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="appearance" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Group Icon</label>
                    <div className="grid grid-cols-8 gap-2 p-3 bg-zinc-800 neon-border-light rounded-lg max-h-40 overflow-y-auto">
                      {hackerIcons.map((iconData) => {
                        const IconComponent = iconData.icon;
                        return (
                          <button
                            key={iconData.id}
                            onClick={() => setEditGroupIcon(iconData.id)}
                            className={`p-2 rounded-lg transition flex items-center justify-center ${
                              editGroupIcon === iconData.id 
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
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Group Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {groupThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setEditGroupTheme(theme.id)}
                          className={`p-3 rounded-lg border text-left transition ${
                            editGroupTheme === theme.id
                              ? 'border-green-500/50 bg-green-500/10 text-green-400'
                              : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                          }`}
                        >
                          <div className="font-medium text-sm">{theme.name}</div>
                          <div className="text-xs opacity-70">{theme.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Accent Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {groupColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setEditGroupColor(color)}
                          className={`w-10 h-10 rounded-lg transition ${
                            editGroupColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="advanced" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Member Limit (0 = Unlimited)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={editGroupMemberLimit}
                      onChange={(e) => setEditGroupMemberLimit(parseInt(e.target.value) || 0)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoApprove"
                        checked={editGroupAutoApprove}
                        onChange={(e) => setEditGroupAutoApprove(e.target.checked)}
                        className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                      />
                      <label htmlFor="autoApprove" className="text-sm text-zinc-300">
                        Auto-approve join requests
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allowFileSharing"
                        checked={editGroupAllowFileSharing}
                        onChange={(e) => setEditGroupAllowFileSharing(e.target.checked)}
                        className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                      />
                      <label htmlFor="allowFileSharing" className="text-sm text-zinc-300">
                        Allow file sharing in chat
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="allowBots"
                        checked={editGroupAllowBots}
                        onChange={(e) => setEditGroupAllowBots(e.target.checked)}
                        className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                      />
                      <label htmlFor="allowBots" className="text-sm text-zinc-300">
                        Allow bots and integrations
                      </label>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                    <h4 className="font-medium text-zinc-200 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Group Analytics Preview
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-zinc-400">Messages Today</div>
                        <div className="text-green-400 font-semibold">142</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Active Members</div>
                        <div className="text-green-400 font-semibold">{selectedGroup?.memberCount || 0}</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Files Shared</div>
                        <div className="text-green-400 font-semibold">23</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Growth Rate</div>
                        <div className="text-green-400 font-semibold">+12%</div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
              
              <div className="flex gap-3 pt-6 border-t border-zinc-700 mt-6">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button 
                  onClick={saveGroupEdit}
                  disabled={!editGroupName.trim()}
                  className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
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
              style={{
                borderColor: (group as any).color ? `${(group as any).color}40` : undefined
              }}
            >
              <div className="flex gap-4">
                <div 
                  className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    backgroundColor: (group as any).color || '#10b981',
                    border: `2px solid ${(group as any).color || '#10b981'}40`
                  }}
                >
                  {(() => {
                    const groupIcon = (group as any).icon;
                    const iconData = hackerIcons.find(icon => icon.id === groupIcon);
                    if (iconData) {
                      const IconComponent = iconData.icon;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    }
                    return <Users className="w-8 h-8 text-white" />;
                  })()}
                </div>

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
                        {(group as any).tags && (group as any).tags.length > 0 && (
                          <div className="flex gap-1">
                            {(group as any).tags.slice(0, 1).map((tag: string) => (
                              <span 
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: `${(group as any).color || '#10b981'}80` }}
                              >
                                {tag}
                              </span>
                            ))}
                            {(group as any).tags.length > 1 && (
                              <span 
                                className="text-xs px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: `${(group as any).color || '#10b981'}80` }}
                              >
                                +{(group as any).tags.length - 1}
                              </span>
                            )}
                          </div>
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

      {/* Invite Members Dialog */}
      <Dialog.Root open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-lg z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-green-400" />
              Invite Members to {selectedGroup?.name}
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search users by username..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg pl-10 pr-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              {memberSearchQuery && (
                <div className="max-h-48 overflow-y-auto bg-zinc-800 neon-border-light rounded-lg">
                  {filteredUsersForInvite.slice(0, 8).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-700 transition"
                    >
                      <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                        <Avatar.Image src={user.avatar} />
                        <Avatar.Fallback className="bg-zinc-600 flex items-center justify-center text-xs">
                          {user.username[0]}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-100">{user.username}</p>
                        <p className="text-xs text-zinc-500">{user.fullName}</p>
                      </div>
                      <button
                        onClick={() => toggleUserSelection(user.username)}
                        className={`px-3 py-1 text-xs rounded transition ${
                          selectedInviteUsers.includes(user.username)
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                        }`}
                      >
                        {selectedInviteUsers.includes(user.username) ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  ))}
                  {filteredUsersForInvite.length === 0 && (
                    <div className="p-3 text-center text-zinc-500 text-sm">
                      No users found
                    </div>
                  )}
                </div>
              )}
              
              {selectedInviteUsers.length > 0 && (
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Selected users ({selectedInviteUsers.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInviteUsers.map((username) => (
                      <div
                        key={username}
                        className="flex items-center gap-2 bg-zinc-800 neon-border-light rounded-lg px-3 py-1"
                      >
                        <span className="text-sm text-green-400">{username}</span>
                        <button
                          onClick={() => toggleUserSelection(username)}
                          className="text-green-400 hover:text-zinc-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Dialog.Close asChild>
                  <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                    Cancel
                  </button>
                </Dialog.Close>
                <button 
                  onClick={inviteMultipleMembers}
                  disabled={selectedInviteUsers.length === 0}
                  className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Invite {selectedInviteUsers.length > 0 ? `(${selectedInviteUsers.length})` : ''}
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
