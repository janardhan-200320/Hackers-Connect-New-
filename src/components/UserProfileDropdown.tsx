// src/components/UserProfileDropdown.tsx

import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';

// Define a type for the user data
interface UserProfile {
  username: string;
  avatarInitial: string; // e.g., the first letter of the username
}

// Dummy user data for demonstration
const currentUser: UserProfile = {
  username: 'n0va',
  avatarInitial: 'N',
};

const UserProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // This effect handles closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Add event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-900/80 border-2 border-emerald-500 text-emerald-300 font-bold hover:shadow-glow hover:border-emerald-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50"
      >
        {currentUser.avatarInitial}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-64 bg-cyber-panel border border-emerald-400/30 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-emerald-500/20">
            <p className="font-bold text-white">Signed in as</p>
            <p className="text-emerald-400">@{currentUser.username}</p>
          </div>
          <nav className="p-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-emerald-500/10 hover:text-white rounded-md transition-colors">
              <User className="w-5 h-5 text-emerald-400" />
              <span>View Profile</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-emerald-500/10 hover:text-white rounded-md transition-colors">
              <Settings className="w-5 h-5 text-emerald-400" />
              <span>Settings</span>
            </a>
            <div className="my-1 h-px bg-emerald-500/20"></div>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;