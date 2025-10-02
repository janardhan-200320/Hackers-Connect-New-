import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { mockEvents } from "@/lib/mockData";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [attendingEvents] = useState<Set<string>>(new Set(["1", "2"]));

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "attending")
      return matchesSearch && attendingEvents.has(event.id);
    if (selectedTab === "online") return matchesSearch && event.isOnline;
    if (selectedTab === "upcoming") {
      const eventDate = new Date(event.date);
      const now = new Date();
      return matchesSearch && eventDate > now;
    }

    return matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CTF":
        return "border-red-500/50 bg-red-500/10 text-red-400";
      case "Conference":
        return "border-blue-500/50 bg-blue-500/10 text-blue-400";
      case "Workshop":
        return "border-green-500/50 bg-green-500/10 text-green-400";
      case "Meetup":
        return "border-purple-500/50 bg-purple-500/10 text-purple-400";
      default:
        return "border-zinc-600 bg-zinc-800 text-zinc-400";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Events</h1>
          <p className="text-zinc-400">
            Discover and join cybersecurity events
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>
          <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
            <Filter className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              All Events
            </Tabs.Trigger>
            <Tabs.Trigger
              value="upcoming"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Upcoming
            </Tabs.Trigger>
            <Tabs.Trigger
              value="online"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Online
            </Tabs.Trigger>
            <Tabs.Trigger
              value="attending"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Attending
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const isAttending = attendingEvents.has(event.id);

            return (
              <div
                key={event.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-zinc-800 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-zinc-500 uppercase">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-xl font-bold text-zinc-100">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-zinc-100">
                            {event.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded border ${getTypeColor(
                              event.type
                            )}`}
                          >
                            {event.type}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            {event.isOnline ? (
                              <>
                                <Globe className="w-3 h-3" />
                                Online
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
                            {event.attendees} attending
                          </div>
                        </div>
                      </div>

                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                          isAttending
                            ? "bg-green-500/10 text-green-400 border border-green-500/50 hover:bg-green-500/20"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isAttending ? "Attending" : "Attend"}
                      </button>
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
          </div>
        )}
      </div>
    </div>
  );
}
