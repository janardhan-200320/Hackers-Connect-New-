import { useState, useRef } from "react";
import {
  Calendar, MapPin, Users, Globe, Clock, Search, Filter, Plus, X, 
  Video, Wifi, Star, ExternalLink, Edit, Trash2, Copy, Share2,
  QrCode, BarChart3, TrendingUp, Award, Target, Code, Shield,
  Zap, Cpu, Database, Terminal, Bug, Key, Eye, Network, Settings,
  Bell, CheckCircle, AlertCircle, Info, MoreVertical, Link, Flag,
  Coffee
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { mockEvents } from "@/lib/mockData";

// Enhanced Event interface
interface Event {
  id: string;
  name: string;
  description: string;
  details: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  category: string;
  difficulty: string;
  isOnline: boolean;
  location?: string;
  venue?: {
    name: string;
    address: string;
    city: string;
    country: string;
    capacity: number;
  };
  onlineDetails?: {
    platform: string;
    meetingLink: string;
    meetingId: string;
    password?: string;
    streamingLink?: string;
  };
  attendees: number;
  maxAttendees: number;
  price: number;
  currency: string;
  tags: string[];
  organizer: {
    name: string;
    email: string;
    organization: string;
  };
  speakers: Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
  }>;
  agenda: Array<{
    time: string;
    title: string;
    description: string;
    speaker?: string;
  }>;
  requirements: string[];
  prizes?: Array<{
    place: string;
    prize: string;
    amount: number;
  }>;
  sponsors: Array<{
    name: string;
    logo: string;
    tier: string;
  }>;
  registrationDeadline: string;
  isPublic: boolean;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Event types and categories
const eventTypes = [
  { id: 'conference', name: 'Conference', icon: Users, color: '#3b82f6' },
  { id: 'workshop', name: 'Workshop', icon: Code, color: '#10b981' },
  { id: 'ctf', name: 'CTF Competition', icon: Flag, color: '#ef4444' },
  { id: 'meetup', name: 'Meetup', icon: Coffee, color: '#8b5cf6' },
  { id: 'hackathon', name: 'Hackathon', icon: Zap, color: '#f59e0b' },
  { id: 'training', name: 'Training', icon: Target, color: '#06b6d4' },
  { id: 'webinar', name: 'Webinar', icon: Video, color: '#84cc16' },
  { id: 'bootcamp', name: 'Bootcamp', icon: Shield, color: '#ec4899' }
];

const eventCategories = [
  'Web Security', 'Network Security', 'Cryptography', 'Reverse Engineering',
  'Malware Analysis', 'Digital Forensics', 'Penetration Testing', 'Bug Bounty',
  'Social Engineering', 'Hardware Security', 'Mobile Security', 'Cloud Security',
  'AI/ML Security', 'Blockchain Security', 'IoT Security', 'DevSecOps'
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: '#10b981' },
  { id: 'intermediate', name: 'Intermediate', color: '#f59e0b' },
  { id: 'advanced', name: 'Advanced', color: '#ef4444' },
  { id: 'expert', name: 'Expert', color: '#8b5cf6' }
];

const onlinePlatforms = [
  'Zoom', 'Google Meet', 'Microsoft Teams', 'Discord', 'Twitch', 'YouTube Live',
  'Jitsi Meet', 'WebEx', 'GoToWebinar', 'BigBlueButton'
];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [attendingEvents, setAttendingEvents] = useState<Set<string>>(new Set(["1", "2"]));
  const [events, setEvents] = useState<Event[]>(mockEvents as Event[]);
  
  // Create Event State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventType, setEventType] = useState("conference");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDifficulty, setEventDifficulty] = useState("beginner");
  const [isOnline, setIsOnline] = useState(true);
  const [eventPrice, setEventPrice] = useState(0);
  const [maxAttendees, setMaxAttendees] = useState(100);
  const [isPublic, setIsPublic] = useState(true);
  const [eventTags, setEventTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Offline Event State
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [venueCapacity, setVenueCapacity] = useState(100);
  
  // Online Event State
  const [onlinePlatform, setOnlinePlatform] = useState("Zoom");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [meetingPassword, setMeetingPassword] = useState("");
  const [streamingLink, setStreamingLink] = useState("");
  
  // Organizer State
  const [organizerName, setOrganizerName] = useState("0xRaven");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerOrg, setOrganizerOrg] = useState("");
  
  // Edit Event State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editEventData, setEditEventData] = useState<Partial<Event>>({});

  // Filter State
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [locationFilter, setLocationFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [capacityFilter, setCapacityFilter] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [organizerFilter, setOrganizerFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply advanced filters
    const matchesEventType = selectedEventTypes.length === 0 || selectedEventTypes.includes(event.type);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(event.difficulty);
    const matchesPrice = event.price >= priceRange.min && event.price <= priceRange.max;
    
    // Date range filter
    const matchesDateRange = (() => {
      if (!dateRange.start && !dateRange.end) return true;
      const eventDate = new Date(event.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date('1900-01-01');
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date('2100-12-31');
      return eventDate >= startDate && eventDate <= endDate;
    })();
    
    // Location filter
    const matchesLocation = (() => {
      if (locationFilter === 'all') return true;
      if (locationFilter === 'online') return event.isOnline;
      if (locationFilter === 'offline') return !event.isOnline;
      return true;
    })();
    
    // Capacity filter
    const matchesCapacity = event.maxAttendees >= capacityFilter.min && event.maxAttendees <= capacityFilter.max;
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(event.status);
    
    // Organizer filter
    const matchesOrganizer = !organizerFilter || 
      event.organizer.name.toLowerCase().includes(organizerFilter.toLowerCase()) ||
      event.organizer.organization?.toLowerCase().includes(organizerFilter.toLowerCase());
    
    // Tags filter
    const matchesTags = tagsFilter.length === 0 || 
      tagsFilter.some(filterTag => event.tags?.some(eventTag => 
        eventTag.toLowerCase().includes(filterTag.toLowerCase())
      ));

    const baseMatches = matchesSearch && matchesEventType && matchesCategory && 
      matchesDifficulty && matchesPrice && matchesDateRange && matchesLocation && 
      matchesCapacity && matchesStatus && matchesOrganizer && matchesTags;

    if (selectedTab === "attending")
      return baseMatches && attendingEvents.has(event.id);
    if (selectedTab === "online") return baseMatches && event.isOnline;
    if (selectedTab === "upcoming") {
      const eventDate = new Date(event.date);
      const now = new Date();
      return baseMatches && eventDate > now;
    }
    if (selectedTab === "my-events")
      return baseMatches && event.createdBy === "0xRaven";

    return baseMatches;
  });

  const getTypeColor = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType ? eventType.color : '#6b7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level ? level.color : '#6b7280';
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !eventTags.includes(tag.trim()) && eventTags.length < 5) {
      setEventTags([...eventTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEventTags(eventTags.filter(tag => tag !== tagToRemove));
  };

  // Filter helper functions
  const clearAllFilters = () => {
    setSelectedEventTypes([]);
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setPriceRange({ min: 0, max: 1000 });
    setDateRange({ start: "", end: "" });
    setLocationFilter('all');
    setCapacityFilter({ min: 0, max: 10000 });
    setStatusFilter([]);
    setOrganizerFilter("");
    setTagsFilter([]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedEventTypes.length > 0) count++;
    if (selectedCategories.length > 0) count++;
    if (selectedDifficulties.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 1000) count++;
    if (dateRange.start || dateRange.end) count++;
    if (locationFilter !== 'all') count++;
    if (capacityFilter.min > 0 || capacityFilter.max < 10000) count++;
    if (statusFilter.length > 0) count++;
    if (organizerFilter) count++;
    if (tagsFilter.length > 0) count++;
    return count;
  };

  const toggleArrayFilter = (array: string[], setArray: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  const resetCreateForm = () => {
    setEventName("");
    setEventDescription("");
    setEventDetails("");
    setEventDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventType("conference");
    setEventCategory("");
    setEventDifficulty("beginner");
    setIsOnline(true);
    setEventPrice(0);
    setMaxAttendees(100);
    setIsPublic(true);
    setEventTags([]);
    setTagInput("");
    setVenueName("");
    setVenueAddress("");
    setVenueCity("");
    setVenueCountry("");
    setVenueCapacity(100);
    setOnlinePlatform("Zoom");
    setMeetingLink("");
    setMeetingId("");
    setMeetingPassword("");
    setStreamingLink("");
    setOrganizerEmail("");
    setOrganizerOrg("");
  };

  const createEvent = () => {
    if (!eventName.trim() || !eventDescription.trim() || !eventDate) return;
    
    const newEvent: Event = {
      id: Date.now().toString(),
      name: eventName,
      description: eventDescription,
      details: eventDetails,
      date: eventDate,
      startTime: eventStartTime,
      endTime: eventEndTime,
      type: eventType,
      category: eventCategory,
      difficulty: eventDifficulty,
      isOnline,
      location: isOnline ? 'Online' : `${venueCity}, ${venueCountry}`,
      venue: isOnline ? undefined : {
        name: venueName,
        address: venueAddress,
        city: venueCity,
        country: venueCountry,
        capacity: venueCapacity
      },
      onlineDetails: isOnline ? {
        platform: onlinePlatform,
        meetingLink,
        meetingId,
        password: meetingPassword,
        streamingLink
      } : undefined,
      attendees: 0,
      maxAttendees,
      price: eventPrice,
      currency: 'USD',
      tags: eventTags,
      organizer: {
        name: organizerName,
        email: organizerEmail,
        organization: organizerOrg
      },
      speakers: [],
      agenda: [],
      requirements: [],
      sponsors: [],
      registrationDeadline: eventDate,
      isPublic,
      status: 'published',
      createdBy: "0xRaven",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEvents([newEvent, ...events]);
    setCreateDialogOpen(false);
    resetCreateForm();
    alert('Event created successfully! 🎉');
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setEditEventData({ ...event });
    setEditDialogOpen(true);
  };

  const saveEventEdit = () => {
    if (!selectedEvent || !editEventData.name?.trim()) return;
    
    const updatedEvent = {
      ...selectedEvent,
      ...editEventData,
      updatedAt: new Date().toISOString()
    };
    
    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setEditDialogOpen(false);
    setSelectedEvent(null);
    setEditEventData({});
    alert('Event updated successfully! ✨');
  };

  const cancelEvent = (eventId: string) => {
    if (confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, status: 'cancelled' } : e
      ));
      alert('Event has been cancelled.');
    }
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event has been deleted.');
    }
  };

  const toggleAttendance = (eventId: string) => {
    const newAttendingEvents = new Set(attendingEvents);
    if (attendingEvents.has(eventId)) {
      newAttendingEvents.delete(eventId);
      // Update attendee count
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, attendees: Math.max(0, e.attendees - 1) } : e
      ));
    } else {
      newAttendingEvents.add(eventId);
      // Update attendee count
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e
      ));
    }
    setAttendingEvents(newAttendingEvents);
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard! 📋');
  };

  const formatDateTime = (date: string, time: string) => {
    const eventDate = new Date(`${date}T${time}`);
    return eventDate.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Events</h1>
          <p className="text-sm text-zinc-500">
            Discover and join cybersecurity events worldwide
          </p>
        </div>
        <Dialog.Root open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="px-4 py-2 neon-button-light text-white rounded-lg transition group">
              <Plus className="w-4 h-4 inline mr-2 group-hover:rotate-90 transition-transform" />
              Create Event
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-4xl z-50 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-400" />
                Create New Event
              </Dialog.Title>
              
              <Tabs.Root defaultValue="basic" className="w-full">
                <Tabs.List className="grid w-full grid-cols-4 mb-6">
                  <Tabs.Trigger
                    value="basic"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Basic Info
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="details"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Event Details
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="location"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Location
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="advanced"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
                  >
                    Advanced
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Event Name *</label>
                      <input
                        type="text"
                        placeholder="Enter event name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Event Type *</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      >
                        {eventTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Description *</label>
                    <textarea
                      placeholder="Brief description of the event"
                      rows={3}
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 resize-none outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Detailed Information</label>
                    <textarea
                      placeholder="Detailed event information, agenda, what participants will learn..."
                      rows={4}
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 resize-none outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Date *</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">End Time</label>
                      <input
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                      <select
                        value={eventCategory}
                        onChange={(e) => setEventCategory(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select Category</option>
                        {eventCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Difficulty Level</label>
                      <select
                        value={eventDifficulty}
                        onChange={(e) => setEventDifficulty(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      >
                        {difficultyLevels.map((level) => (
                          <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Price (USD)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={eventPrice}
                        onChange={(e) => setEventPrice(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Max Attendees</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="100"
                        value={maxAttendees}
                        onChange={(e) => setMaxAttendees(parseInt(e.target.value) || 100)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Tags (Max 5)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTag(tagInput);
                            setTagInput("");
                          }
                        }}
                        className="flex-1 bg-zinc-800 neon-border-light rounded-lg px-3 py-1 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => {
                          addTag(tagInput);
                          setTagInput("");
                        }}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition"
                      >
                        Add
                      </button>
                    </div>
                    
                    {eventTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {eventTags.map((tag) => (
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

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 text-green-400 bg-zinc-800 border-zinc-700 rounded focus:ring-green-500"
                      />
                      <label htmlFor="isPublic" className="text-sm text-zinc-300">
                        Make this event public
                      </label>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="location" className="space-y-4">
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setIsOnline(true)}
                      className={`flex-1 p-4 rounded-lg border-2 transition ${
                        isOnline 
                          ? 'border-green-500 bg-green-500/10 text-green-400' 
                          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Online Event</div>
                      <div className="text-sm opacity-70">Virtual meeting</div>
                    </button>
                    
                    <button
                      onClick={() => setIsOnline(false)}
                      className={`flex-1 p-4 rounded-lg border-2 transition ${
                        !isOnline 
                          ? 'border-green-500 bg-green-500/10 text-green-400' 
                          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <MapPin className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-medium">Offline Event</div>
                      <div className="text-sm opacity-70">Physical location</div>
                    </button>
                  </div>

                  {isOnline ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Platform</label>
                        <select
                          value={onlinePlatform}
                          onChange={(e) => setOnlinePlatform(e.target.value)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                        >
                          {onlinePlatforms.map((platform) => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Meeting Link</label>
                        <input
                          type="url"
                          placeholder="https://zoom.us/j/123456789"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Meeting ID</label>
                          <input
                            type="text"
                            placeholder="123 456 789"
                            value={meetingId}
                            onChange={(e) => setMeetingId(e.target.value)}
                            className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Password (Optional)</label>
                          <input
                            type="text"
                            placeholder="Meeting password"
                            value={meetingPassword}
                            onChange={(e) => setMeetingPassword(e.target.value)}
                            className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Streaming Link (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://youtube.com/live/..."
                          value={streamingLink}
                          onChange={(e) => setStreamingLink(e.target.value)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Venue Name</label>
                        <input
                          type="text"
                          placeholder="Conference Center, Hotel, etc."
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Address</label>
                        <input
                          type="text"
                          placeholder="Street address"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">City</label>
                          <input
                            type="text"
                            placeholder="City"
                            value={venueCity}
                            onChange={(e) => setVenueCity(e.target.value)}
                            className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">Country</label>
                          <input
                            type="text"
                            placeholder="Country"
                            value={venueCountry}
                            onChange={(e) => setVenueCountry(e.target.value)}
                            className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Venue Capacity</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="100"
                          value={venueCapacity}
                          onChange={(e) => setVenueCapacity(parseInt(e.target.value) || 100)}
                          className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  )}
                </Tabs.Content>

                <Tabs.Content value="advanced" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Organizer Name</label>
                      <input
                        type="text"
                        value={organizerName}
                        onChange={(e) => setOrganizerName(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Contact Email</label>
                      <input
                        type="email"
                        placeholder="organizer@example.com"
                        value={organizerEmail}
                        onChange={(e) => setOrganizerEmail(e.target.value)}
                        className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Organization</label>
                    <input
                      type="text"
                      placeholder="Company or organization name"
                      value={organizerOrg}
                      onChange={(e) => setOrganizerOrg(e.target.value)}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h4 className="font-medium text-zinc-200 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                      Event Analytics Preview
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-zinc-400">Expected Views</div>
                        <div className="text-green-400 font-semibold">2.5K+</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Potential Reach</div>
                        <div className="text-green-400 font-semibold">10K+</div>
                      </div>
                      <div>
                        <div className="text-zinc-400">Engagement Rate</div>
                        <div className="text-green-400 font-semibold">85%</div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
              
              <div className="flex gap-3 pt-6 border-t border-zinc-700 mt-6">
                <Dialog.Close asChild>
                  <button 
                    onClick={resetCreateForm}
                    className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button 
                  onClick={createEvent}
                  disabled={!eventName.trim() || !eventDescription.trim() || !eventDate}
                  className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Event
                </button>
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
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 neon-border-light rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {/* Advanced Filter Dropdown */}
          <DropdownMenu.Root open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="relative p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-zinc-400 neon-border-light">
                <Filter className="w-5 h-5" />
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </DropdownMenu.Trigger>
            
            <DropdownMenu.Portal>
              <DropdownMenu.Content 
                className="bg-zinc-900 neon-border-light rounded-lg p-4 w-80 max-h-96 overflow-y-auto shadow-2xl z-50"
                align="end"
                sideOffset={8}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-700">
                    <h3 className="text-sm font-semibold text-green-400">Advanced Filters</h3>
                    <button 
                      onClick={clearAllFilters}
                      className="text-xs text-zinc-400 hover:text-green-400 transition"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Event Types */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Event Types</label>
                    <div className="grid grid-cols-2 gap-2">
                      {eventTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => toggleArrayFilter(selectedEventTypes, setSelectedEventTypes, type.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs transition ${
                            selectedEventTypes.includes(type.id)
                              ? 'neon-button-light text-green-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          <type.icon className="w-3 h-3" style={{ color: type.color }} />
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Categories</label>
                    <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                      {eventCategories.slice(0, 8).map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleArrayFilter(selectedCategories, setSelectedCategories, category)}
                          className={`text-left p-2 rounded text-xs transition ${
                            selectedCategories.includes(category)
                              ? 'neon-button-light text-green-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Levels */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Difficulty</label>
                    <div className="flex gap-2">
                      {difficultyLevels.map((level) => (
                        <button
                          key={level.id}
                          onClick={() => toggleArrayFilter(selectedDifficulties, setSelectedDifficulties, level.id)}
                          className={`px-3 py-1 rounded-full text-xs transition ${
                            selectedDifficulties.includes(level.id)
                              ? 'neon-button-light text-green-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                          style={{ 
                            borderColor: selectedDifficulties.includes(level.id) ? level.color : 'transparent',
                            borderWidth: '1px'
                          }}
                        >
                          {level.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Location</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'all', name: 'All Events', icon: Globe },
                        { id: 'online', name: 'Online', icon: Wifi },
                        { id: 'offline', name: 'In-Person', icon: MapPin }
                      ].map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => setLocationFilter(loc.id as any)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition ${
                            locationFilter === loc.id
                              ? 'neon-button-light text-green-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          <loc.icon className="w-3 h-3" />
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Price Range ($)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-20 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-100"
                        placeholder="Min"
                      />
                      <span className="text-zinc-500 text-xs">to</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-20 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-100"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Date Range</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="flex-1 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-100"
                      />
                      <span className="text-zinc-500 text-xs">to</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="flex-1 bg-zinc-800 rounded px-2 py-1 text-xs text-zinc-100"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Event Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['published', 'ongoing', 'upcoming', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => toggleArrayFilter(statusFilter, setStatusFilter, status)}
                          className={`px-2 py-1 rounded text-xs transition capitalize ${
                            statusFilter.includes(status)
                              ? 'neon-button-light text-green-400'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Organizer Search */}
                  <div>
                    <label className="text-xs font-medium text-zinc-300 mb-2 block">Organizer</label>
                    <input
                      type="text"
                      value={organizerFilter}
                      onChange={(e) => setOrganizerFilter(e.target.value)}
                      placeholder="Search organizer..."
                      className="w-full bg-zinc-800 rounded px-3 py-1 text-xs text-zinc-100 placeholder-zinc-500"
                    />
                  </div>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* Quick Filter Shortcuts */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500">Quick Filters:</span>
          <button
            onClick={() => setLocationFilter('online')}
            className={`px-3 py-1 rounded-full text-xs transition flex items-center gap-1 ${
              locationFilter === 'online'
                ? 'neon-button-light text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Wifi className="w-3 h-3" />
            Online Only
          </button>
          <button
            onClick={() => setPriceRange({ min: 0, max: 0 })}
            className={`px-3 py-1 rounded-full text-xs transition ${
              priceRange.max === 0
                ? 'neon-button-light text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Free Events
          </button>
          <button
            onClick={() => toggleArrayFilter(selectedEventTypes, setSelectedEventTypes, 'ctf')}
            className={`px-3 py-1 rounded-full text-xs transition flex items-center gap-1 ${
              selectedEventTypes.includes('ctf')
                ? 'neon-button-light text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Flag className="w-3 h-3" />
            CTF Only
          </button>
          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
              setDateRange({ start: today, end: nextWeek });
            }}
            className={`px-3 py-1 rounded-full text-xs transition flex items-center gap-1 ${
              dateRange.start && dateRange.end
                ? 'neon-button-light text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            <Calendar className="w-3 h-3" />
            This Week
          </button>
          <button
            onClick={() => toggleArrayFilter(selectedDifficulties, setSelectedDifficulties, 'beginner')}
            className={`px-3 py-1 rounded-full text-xs transition ${
              selectedDifficulties.includes('beginner')
                ? 'neon-button-light text-green-400'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            Beginner Friendly
          </button>
        </div>

        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              All Events
            </Tabs.Trigger>
            <Tabs.Trigger
              value="upcoming"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              Upcoming
            </Tabs.Trigger>
            <Tabs.Trigger
              value="online"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              Online
            </Tabs.Trigger>
            <Tabs.Trigger
              value="attending"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              Attending
            </Tabs.Trigger>
            <Tabs.Trigger
              value="my-events"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:neon-button-light data-[state=active]:text-green-400 transition"
            >
              My Events
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {/* Active Filter Badges */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-zinc-400">Active Filters:</span>
            
            {selectedEventTypes.map(type => {
              const typeData = eventTypes.find(t => t.id === type);
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400"
                >
                  {typeData && <typeData.icon className="w-3 h-3" />}
                  {typeData?.name}
                  <button
                    onClick={() => toggleArrayFilter(selectedEventTypes, setSelectedEventTypes, type)}
                    className="ml-1 hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            
            {selectedCategories.map(category => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400"
              >
                {category}
                <button
                  onClick={() => toggleArrayFilter(selectedCategories, setSelectedCategories, category)}
                  className="ml-1 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {selectedDifficulties.map(difficulty => {
              const diffData = difficultyLevels.find(d => d.id === difficulty);
              return (
                <span
                  key={difficulty}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400"
                >
                  {diffData?.name}
                  <button
                    onClick={() => toggleArrayFilter(selectedDifficulties, setSelectedDifficulties, difficulty)}
                    className="ml-1 hover:text-red-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            
            {locationFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400">
                {locationFilter === 'online' ? <Wifi className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {locationFilter === 'online' ? 'Online' : 'In-Person'}
                <button
                  onClick={() => setLocationFilter('all')}
                  className="ml-1 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {(priceRange.min > 0 || priceRange.max < 1000) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400">
                ${priceRange.min}-${priceRange.max}
                <button
                  onClick={() => setPriceRange({ min: 0, max: 1000 })}
                  className="ml-1 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {(dateRange.start || dateRange.end) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400">
                <Calendar className="w-3 h-3" />
                {dateRange.start || '...'} - {dateRange.end || '...'}
                <button
                  onClick={() => setDateRange({ start: "", end: "" })}
                  className="ml-1 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {organizerFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 neon-border-light rounded-full text-xs text-green-400">
                <Users className="w-3 h-3" />
                {organizerFilter}
                <button
                  onClick={() => setOrganizerFilter("")}
                  className="ml-1 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/20 border border-red-500/30 rounded-full text-xs text-red-400 hover:bg-red-900/40 transition"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">
            Showing {filteredEvents.length} of {events.length} events
          </span>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-green-900/20 border border-green-500/30 rounded-full text-xs text-green-400">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
            </span>
          )}
        </div>
        
        {filteredEvents.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <TrendingUp className="w-4 h-4" />
            <span>Results updated in real-time</span>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {filteredEvents.map((event) => {
          const isAttending = attendingEvents.has(event.id);
          const isOwner = event.createdBy === "0xRaven";
          const eventTypeData = eventTypes.find(t => t.id === event.type);
          const EventIcon = eventTypeData?.icon || Calendar;

          return (
            <div
              key={event.id}
              className="bg-zinc-900 neon-border-light hover:border-green-400 rounded-xl p-6 transition cursor-pointer group feed-card"
              style={{
                borderColor: event.status === 'cancelled' ? '#ef4444' : undefined,
                opacity: event.status === 'cancelled' ? 0.7 : 1
              }}
            >
              <div className="flex gap-4">
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: getTypeColor(event.type) + '20', border: `2px solid ${getTypeColor(event.type)}40` }}
                >
                  <EventIcon className="w-8 h-8" style={{ color: getTypeColor(event.type) }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-zinc-100 group-hover:text-green-400 transition">
                          {event.name}
                        </h3>
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded border"
                          style={{
                            borderColor: getTypeColor(event.type) + '50',
                            backgroundColor: getTypeColor(event.type) + '10',
                            color: getTypeColor(event.type)
                          }}
                        >
                          {eventTypeData?.name || event.type}
                        </span>
                        {event.status === 'cancelled' && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded border border-red-500/50 bg-red-500/10 text-red-400">
                            Cancelled
                          </span>
                        )}
                        {event.price === 0 && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded border border-green-500/50 bg-green-500/10 text-green-400">
                            Free
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-zinc-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {event.startTime && ` at ${event.startTime}`}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {event.isOnline ? (
                            <>
                              <Globe className="w-3 h-3" />
                              Online ({event.onlineDetails?.platform || 'Virtual'})
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.attendees} / {event.maxAttendees} attending
                        </div>
                        
                        {event.difficulty && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" style={{ color: getDifficultyColor(event.difficulty) }} />
                            <span style={{ color: getDifficultyColor(event.difficulty) }}>
                              {difficultyLevels.find(d => d.id === event.difficulty)?.name}
                            </span>
                          </div>
                        )}
                        
                        {event.price > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-green-400">${event.price}</span>
                          </div>
                        )}
                      </div>

                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: `${getTypeColor(event.type)}60` }}
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span 
                              className="text-xs px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: `${getTypeColor(event.type)}60` }}
                            >
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {event.isOnline && event.onlineDetails?.meetingLink && isAttending && (
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => window.open(event.onlineDetails!.meetingLink, '_blank')}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Join Meeting
                          </button>
                          <button
                            onClick={() => copyMeetingLink(event.onlineDetails!.meetingLink)}
                            className="flex items-center gap-1 px-3 py-1 bg-zinc-700/50 text-zinc-400 rounded-lg text-xs hover:bg-zinc-700 transition"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {event.status !== 'cancelled' && (
                        <button
                          onClick={() => toggleAttendance(event.id)}
                          disabled={event.attendees >= event.maxAttendees && !isAttending}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                            isAttending
                              ? "bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20"
                              : event.attendees >= event.maxAttendees
                                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {isAttending ? "Attending" : event.attendees >= event.maxAttendees ? "Full" : "Attend"}
                        </button>
                      )}
                      
                      {isOwner && (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content className="bg-zinc-900 neon-border-light rounded-lg p-2 min-w-40 shadow-xl">
                              <DropdownMenu.Item 
                                onClick={() => openEditDialog(event)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-green-400 rounded cursor-pointer outline-none"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Event
                              </DropdownMenu.Item>
                              {event.status !== 'cancelled' && (
                                <DropdownMenu.Item 
                                  onClick={() => cancelEvent(event.id)}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-orange-400 rounded cursor-pointer outline-none"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                  Cancel Event
                                </DropdownMenu.Item>
                              )}
                              <DropdownMenu.Item 
                                onClick={() => deleteEvent(event.id)}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-red-400 rounded cursor-pointer outline-none"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Event
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No events found</p>
          <p className="text-sm">Create your first event to get started!</p>
        </div>
      )}

      {/* Edit Event Dialog */}
      <Dialog.Root open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 neon-border-light shadow-xl p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Edit className="w-6 h-6 text-blue-400" />
              Edit Event: {selectedEvent?.name}
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Event Name</label>
                <input
                  type="text"
                  value={editEventData.name || ""}
                  onChange={(e) => setEditEventData({...editEventData, name: e.target.value})}
                  className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={editEventData.description || ""}
                  onChange={(e) => setEditEventData({...editEventData, description: e.target.value})}
                  className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 resize-none outline-none transition focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={editEventData.date || ""}
                    onChange={(e) => setEditEventData({...editEventData, date: e.target.value})}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={editEventData.maxAttendees || ""}
                    onChange={(e) => setEditEventData({...editEventData, maxAttendees: parseInt(e.target.value) || 0})}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {selectedEvent?.isOnline && selectedEvent?.onlineDetails && (
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Meeting Link</label>
                  <input
                    type="url"
                    value={editEventData.onlineDetails?.meetingLink || ""}
                    onChange={(e) => setEditEventData({
                      ...editEventData, 
                      onlineDetails: {...editEventData.onlineDetails, meetingLink: e.target.value}
                    })}
                    className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}

              {selectedEvent?.venue && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Venue Name</label>
                    <input
                      type="text"
                      value={editEventData.venue?.name || ""}
                      onChange={(e) => setEditEventData({
                        ...editEventData, 
                        venue: {...editEventData.venue, name: e.target.value}
                      })}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Address</label>
                    <input
                      type="text"
                      value={editEventData.venue?.address || ""}
                      onChange={(e) => setEditEventData({
                        ...editEventData, 
                        venue: {...editEventData.venue, address: e.target.value}
                      })}
                      className="w-full bg-zinc-800 neon-border-light rounded-lg px-4 py-2 text-zinc-100 outline-none transition focus:ring-2 focus:ring-green-500"
                    />
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
                  onClick={saveEventEdit}
                  disabled={!editEventData.name?.trim()}
                  className="flex-1 px-4 py-2 neon-button-light text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
