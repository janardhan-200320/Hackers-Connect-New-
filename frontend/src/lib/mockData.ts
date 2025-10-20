// Mock data for the application

export const mockUsers = [
  {
    id: "1",
    username: "0xRaven",
    fullName: "Raven Storm",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=0xRaven",
    bio: "Security researcher | CTF enthusiast | Bug bounty hunter",
    reputation: 2847,
    followers: 1234,
    following: 456,
    badges: ["Elite Hacker", "CTF Master", "Bug Hunter"],
  },
  {
    id: "2",
    username: "ByteBandit",
    fullName: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ByteBandit",
    bio: "Reverse engineering wizard | Malware analyst",
    reputation: 1923,
    followers: 892,
    following: 234,
    badges: ["RE Expert", "Malware Hunter"],
  },
  {
    id: "3",
    username: "CryptoCat",
    fullName: "Sarah Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoCat",
    bio: "Cryptography researcher | Breaking ciphers for fun",
    reputation: 3142,
    followers: 2341,
    following: 678,
    badges: ["Crypto Expert", "Math Wizard"],
  },
  {
    id: "4",
    username: "RootNova",
    fullName: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RootNova",
    bio: "Penetration tester | OSCP | Web security specialist",
    reputation: 2156,
    followers: 1567,
    following: 389,
    badges: ["Web Hacker", "Pentester"],
  },
  {
    id: "5",
    username: "PhantomDev",
    fullName: "Emily Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhantomDev",
    bio: "Full-stack developer | Security enthusiast",
    reputation: 1456,
    followers: 734,
    following: 512,
    badges: ["Developer", "CTF Player"],
  },
];

export const mockPosts = [
  {
    id: "1",
    author: mockUsers[0],
    content:
      "Just discovered a critical XSS vulnerability in a popular CMS. Full writeup coming soon! 🔥",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 234,
    comments: 45,
    shares: 12,
    tags: ["XSS", "WebSecurity", "Writeup"],
    images: [
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=400&fit=crop",
    ],
  },
  {
    id: "2",
    author: mockUsers[1],
    content:
      "Reverse engineering the latest ransomware sample. The obfuscation techniques are getting more sophisticated...",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    likes: 189,
    comments: 32,
    shares: 8,
    tags: ["ReverseEngineering", "Malware"],
    codeSnippet: `def decrypt_payload(encrypted_data):
    key = derive_key_from_hash(encrypted_data[:32])
    cipher = AES.new(key, AES.MODE_CBC, iv=encrypted_data[32:48])
    return unpad(cipher.decrypt(encrypted_data[48:]), AES.block_size)`,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    ],
  },
  {
    id: "3",
    author: mockUsers[2],
    content:
      "New blog post: Breaking RSA with low public exponent attacks. This is why key generation matters!",
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    likes: 312,
    comments: 67,
    shares: 23,
    tags: ["Cryptography", "RSA", "Blog"],
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
    ],
  },
  {
    id: "4",
    author: mockUsers[3],
    content:
      "Pwned another box on HackTheBox! Root access achieved through SUID binary exploitation. The feeling never gets old! 💻",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    likes: 156,
    comments: 28,
    shares: 5,
    tags: ["HackTheBox", "Pentest", "Linux"],
    images: [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop",
    ],
  },
  {
    id: "5",
    author: mockUsers[4],
    content:
      "Built a new tool for automated subdomain enumeration. Check it out on GitHub! Contributions welcome. 🚀",
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    likes: 445,
    comments: 89,
    shares: 34,
    tags: ["Tool", "OpenSource", "Recon"],
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&h=400&fit=crop",
    ],
  },
];

export interface GroupMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'file';
  mediaUrl?: string;
  fileName?: string;
}

export interface GroupPost {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar: string;
  isPrivate: boolean;
  posts: number;
  members: string[]; // array of usernames
  admins: string[]; // array of usernames
  createdBy: string;
  createdAt: string;
  messages: GroupMessage[];
  groupPosts: GroupPost[];
  lastActivity: string;
}

export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Web Security Masters",
    description: "Advanced web application security research and CTF discussions",
    memberCount: 3421,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=web",
    isPrivate: false,
    posts: 1234,
    members: ["0xRaven", "ByteBandit", "CryptoCat", "RootNova", "PhantomDev", "DataGhost", "NullByte", "HexHunter"],
    admins: ["0xRaven", "ByteBandit"],
    createdBy: "0xRaven",
    createdAt: "2024-01-15T10:30:00Z",
    lastActivity: "2025-10-10T14:22:00Z",
    messages: [
      {
        id: "msg1",
        senderId: "1",
        senderUsername: "0xRaven",
        content: "Welcome to Web Security Masters! Share your latest findings here.",
        timestamp: "2025-10-10T09:15:00Z",
        type: "text"
      },
      {
        id: "msg2",
        senderId: "2",
        senderUsername: "ByteBandit",
        content: "Found an interesting XSS bypass technique today",
        timestamp: "2025-10-10T10:30:00Z",
        type: "text"
      },
      {
        id: "msg3",
        senderId: "3",
        senderUsername: "CryptoCat",
        content: "Check out this vulnerability assessment report",
        timestamp: "2025-10-10T11:45:00Z",
        type: "file",
        fileName: "security_report.pdf"
      },
      {
        id: "msg4",
        senderId: "4",
        senderUsername: "RootNova",
        content: "Demo of the new exploit",
        timestamp: "2025-10-10T14:22:00Z",
        type: "video",
        mediaUrl: "https://example.com/demo.mp4"
      }
    ],
    groupPosts: [
      {
        id: "post1",
        authorId: "1",
        authorUsername: "0xRaven",
        content: "New SQL injection technique discovered in modern web frameworks",
        timestamp: "2025-10-09T15:30:00Z",
        likes: 45,
        comments: 12,
        type: "text"
      }
    ]
  },
  {
    id: "2",
    name: "Binary Exploitation Club",
    description: "Reverse engineering, binary exploitation, and low-level programming",
    memberCount: 2156,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=binary",
    isPrivate: false,
    posts: 892,
    members: ["ByteBandit", "RootNova", "HexHunter", "DataGhost", "NullByte"],
    admins: ["ByteBandit"],
    createdBy: "ByteBandit",
    createdAt: "2024-02-20T14:15:00Z",
    lastActivity: "2025-10-10T13:15:00Z",
    messages: [
      {
        id: "msg1",
        senderId: "2",
        senderUsername: "ByteBandit",
        content: "Working on a new buffer overflow exploit",
        timestamp: "2025-10-10T08:30:00Z",
        type: "text"
      },
      {
        id: "msg2",
        senderId: "4",
        senderUsername: "RootNova",
        content: "Here's the assembly code analysis",
        timestamp: "2025-10-10T13:15:00Z",
        type: "image",
        mediaUrl: "https://example.com/assembly_analysis.png"
      }
    ],
    groupPosts: []
  },
  {
    id: "3",
    name: "Crypto Warriors",
    description: "Cryptography challenges and cipher breaking",
    memberCount: 1834,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=crypto",
    isPrivate: false,
    posts: 567,
    members: ["CryptoCat", "DataGhost", "0xRaven", "PhantomDev"],
    admins: ["CryptoCat"],
    createdBy: "CryptoCat",
    createdAt: "2024-03-10T09:45:00Z",
    lastActivity: "2025-10-10T12:00:00Z",
    messages: [
      {
        id: "msg1",
        senderId: "3",
        senderUsername: "CryptoCat",
        content: "New cryptographic challenge is live!",
        timestamp: "2025-10-10T12:00:00Z",
        type: "text"
      }
    ],
    groupPosts: []
  },
  {
    id: "4",
    name: "Elite CTF Team",
    description: "Invite-only group for competitive CTF players",
    memberCount: 89,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=elite",
    isPrivate: true,
    posts: 234,
    members: ["0xRaven", "CryptoCat", "ByteBandit"],
    admins: ["0xRaven"],
    createdBy: "0xRaven",
    createdAt: "2024-01-01T00:00:00Z",
    lastActivity: "2025-10-10T16:30:00Z",
    messages: [
      {
        id: "msg1",
        senderId: "1",
        senderUsername: "0xRaven",
        content: "Team strategy for upcoming CTF competition",
        timestamp: "2025-10-10T16:30:00Z",
        type: "text"
      }
    ],
    groupPosts: []
  },
];

export const mockEvents = [
  {
    id: "1",
    name: "CyberSec Summit 2025",
    date: "2025-11-15",
    location: "San Francisco, CA",
    type: "Conference",
    attendees: 2500,
    description:
      "Annual cybersecurity conference featuring talks from industry leaders",
    isOnline: false,
  },
  {
    id: "2",
    name: "HackCon CTF",
    date: "2025-10-28",
    location: "Online",
    type: "CTF",
    attendees: 5000,
    description: "48-hour capture the flag competition with $50k in prizes",
    isOnline: true,
  },
  {
    id: "3",
    name: "Web3 Security Workshop",
    date: "2025-11-05",
    location: "New York, NY",
    type: "Workshop",
    attendees: 150,
    description:
      "Hands-on workshop covering smart contract security and DeFi exploits",
    isOnline: false,
  },
  {
    id: "4",
    name: "Local Hackers Meetup",
    date: "2025-10-20",
    location: "Austin, TX",
    type: "Meetup",
    attendees: 75,
    description:
      "Monthly meetup for security enthusiasts to network and share knowledge",
    isOnline: false,
  },
];

export const mockChallenges = [
  {
    id: "1",
    title: "SQL Injection Master",
    description:
      "Exploit multiple SQL injection vulnerabilities to retrieve the hidden flag",
    difficulty: "Easy",
    category: "Web",
    points: 100,
    solves: 1234,
    flag: "FLAG{SQL_1NJ3CT10N_M4ST3R}",
  },
  {
    id: "2",
    title: "Buffer Overflow Chronicles",
    description:
      "Find and exploit a buffer overflow vulnerability in this Linux binary",
    difficulty: "Medium",
    category: "PWN",
    points: 250,
    solves: 456,
    flag: "FLAG{BUFF3R_0V3RFL0W_PWN3D}",
  },
  {
    id: "3",
    title: "RSA Factorization",
    description: "Factor a weak RSA modulus to decrypt the encrypted message",
    difficulty: "Medium",
    category: "Crypto",
    points: 300,
    solves: 789,
    flag: "FLAG{RS4_F4CT0R1Z4T10N_W1N}",
  },
  {
    id: "4",
    title: "Kernel Exploit",
    description:
      "Exploit a race condition in the Linux kernel to gain root privileges",
    difficulty: "Hard",
    category: "PWN",
    points: 500,
    solves: 123,
    flag: "FLAG{K3RN3L_R00T_4CC3SS}",
  },
];

export const mockComments = [
  {
    id: "1",
    postId: "1",
    author: mockUsers[1],
    content: "Great find! 🔥 Would love to see the full writeup. What CMS was it?",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    likes: 12,
  },
  {
    id: "2",
    postId: "1",
    author: mockUsers[2],
    content: "This is exactly why input validation is so critical. Nice work!",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    likes: 8,
  },
  {
    id: "3",
    postId: "1",
    author: mockUsers[3],
    content: "Have you reported this to the vendor yet? What was their response?",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    likes: 5,
  },
  {
    id: "4",
    postId: "2",
    author: mockUsers[0],
    content: "The obfuscation in that decrypt function is nasty! How did you identify the key derivation method?",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    likes: 15,
  },
  {
    id: "5",
    postId: "2",
    author: mockUsers[4],
    content: "Reverse engineering malware is always fascinating. Thanks for sharing the code snippet!",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    likes: 7,
  },
  {
    id: "6",
    postId: "3",
    author: mockUsers[1],
    content: "RSA with low exponents is such a classic attack vector. Great educational content! 📚",
    timestamp: new Date(Date.now() - 4200000).toISOString(),
    likes: 22,
  },
  {
    id: "7",
    postId: "3",
    author: mockUsers[4],
    content: "This is why I always recommend using proper key generation practices. Bookmarked for reference!",
    timestamp: new Date(Date.now() - 3900000).toISOString(),
    likes: 9,
  },
  {
    id: "8",
    postId: "4",
    author: mockUsers[2],
    content: "OSINT investigations are so rewarding when you finally piece everything together! 🕵️",
    timestamp: new Date(Date.now() - 6000000).toISOString(),
    likes: 18,
  },
];

export const mockNotifications = [
  {
    id: "1",
    type: "like",
    user: mockUsers[1],
    content: "liked your post",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "comment",
    user: mockUsers[2],
    content: "commented on your post",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "follow",
    user: mockUsers[3],
    content: "started following you",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];
