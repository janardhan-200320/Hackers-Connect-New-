// src/routes/Events.tsx
import React, { useEffect, useState } from "react";

type EventType = "CTF" | "Meetup" | "Workshop" | "Conference" | "Other";

type HackerEvent = {
  id: string;
  name: string;
  date: string; // ISO date string
  location: string;
  online: boolean;
  type: EventType;
  description?: string;
  attendees: number;
  attending?: boolean; // whether the current user is attending (local-only)
};

const LOCAL_STORAGE_KEY = "hc_events_v1";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Events(): JSX.Element {
  const [events, setEvents] = useState<HackerEvent[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | EventType | "Online">(
    "All"
  );

  // form state
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    type: "CTF" as EventType,
    online: false,
    description: "",
  });

  // load initial events from localStorage or seed
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        setEvents(JSON.parse(raw));
        return;
      } catch {
        // fallback to seed
      }
    }
    const seed: HackerEvent[] = [
      {
        id: uid(),
        name: "Nullcon",
        date: "2025-10-10",
        location: "Goa",
        online: false,
        type: "Conference",
        description: "A security conference focused on real-world vulnerabilities.",
        attendees: 42,
        attending: false,
      },
      {
        id: uid(),
        name: "InCTF",
        date: "2025-11-21",
        location: "Online",
        online: true,
        type: "CTF",
        description: "An online capture-the-flag event for all skill levels.",
        attendees: 128,
        attending: false,
      },
      {
        id: uid(),
        name: "Bsides BLR",
        date: "2025-12-05",
        location: "Bengaluru",
        online: false,
        type: "Meetup",
        description: "Community meetup for security researchers and enthusiasts.",
        attendees: 88,
        attending: false,
      },
    ];
    setEvents(seed);
  }, []);

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.date) return alert("Name and date are required.");
    const newEvent: HackerEvent = {
      id: uid(),
      name: form.name,
      date: form.date,
      location: form.online ? "Online" : form.location || "TBD",
      online: form.online,
      type: form.type,
      description: form.description,
      attendees: 0,
      attending: false,
    };
    setEvents((s) => [newEvent, ...s]);
    setForm({ name: "", date: "", location: "", type: "CTF", online: false, description: "" });
    setOpenCreate(false);
  };

  const toggleAttend = (id: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== id) return ev;
        const attending = !ev.attending;
        return {
          ...ev,
          attending,
          attendees: attending ? ev.attendees + 1 : Math.max(0, ev.attendees - 1),
        };
      })
    );
  };

  const removeEvent = (id: string) => {
    if (!confirm("Delete this event?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = events
    .filter((ev) => {
      if (filterType === "All") return true;
      if (filterType === "Online") return ev.online;
      return ev.type === filterType;
    })
    .filter((ev) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        ev.name.toLowerCase().includes(q) ||
        ev.location.toLowerCase().includes(q) ||
        (ev.description || "").toLowerCase().includes(q) ||
        ev.type.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-6 min-h-screen bg-hc-900 text-emerald-200">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-wide">Events — Hackers Connect</h1>

          <div className="flex gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, location, type..."
              className="bg-hc-900/60 border border-emerald-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-hc-900/60 border border-emerald-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              <option value="Online">Online</option>
              <option value="CTF">CTF</option>
              <option value="Meetup">Meetup</option>
              <option value="Workshop">Workshop</option>
              <option value="Conference">Conference</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={() => setOpenCreate(true)}
              className="rounded-lg px-4 py-2 border border-emerald-400 hover:shadow glow hover:shadow-emerald-500/30"
            >
              + Create Event
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: status & trending */}
          <aside className="space-y-4">
            <div className="p-4 border border-emerald-600 rounded-2xl">
              <h3 className="text-xs uppercase text-emerald-300">Status</h3>
              <p className="mt-2 text-sm">Guest mode — solve a small CTF to unlock organizer features.</p>
            </div>

            <div className="p-4 border border-emerald-600 rounded-2xl">
              <h3 className="text-xs uppercase text-emerald-300">Trending</h3>
              <ul className="mt-2 text-sm space-y-1">
                <li>• CVE-2025-XXXX PoC released</li>
                <li>• New crypto CTF this weekend</li>
                <li>• Kernel hardening guide</li>
              </ul>
            </div>
          </aside>

          {/* Center: events list */}
          <section className="md:col-span-2 space-y-4">
            {filtered.length === 0 ? (
              <div className="p-6 border border-emerald-600 rounded-xl">No events match your search.</div>
            ) : (
              filtered.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-4 border border-emerald-600 rounded-xl bg-hc-900/40"
                >
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-lg font-medium">{ev.name}</h2>
                      <span className="text-xs px-2 py-1 rounded-md border border-emerald-500/30">
                        {ev.type}
                        {ev.online ? " • Online" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-300 mt-1">
                      {new Date(ev.date).toLocaleDateString()} · {ev.location}
                    </p>
                    {ev.description && <p className="mt-2 text-sm text-emerald-200/80">{ev.description}</p>}
                    <p className="mt-2 text-xs text-emerald-300">{ev.attendees} attending</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleAttend(ev.id)}
                      className={`px-4 py-2 rounded-lg border ${
                        ev.attending ? "bg-emerald-500/20 border-emerald-400" : "border-emerald-600"
                      }`}
                    >
                      {ev.attending ? "Attending" : "Attend"}
                    </button>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          // quick edit: toggle online (for organizers this would require proper auth)
                          if (!confirm("Quick toggle 'online' for this event?")) return;
                          setEvents((prev) => prev.map((x) => (x.id === ev.id ? { ...x, online: !x.online } : x)));
                        }}
                        className="text-xs px-2 py-1 rounded border border-emerald-600"
                      >
                        Toggle Online
                      </button>

                      <button
                        onClick={() => removeEvent(ev.id)}
                        className="text-xs px-2 py-1 rounded border border-rose-600 text-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl bg-hc-900 border border-emerald-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Create Hacker Event</h3>
              <button onClick={() => setOpenCreate(false)} className="text-sm px-2 py-1 border rounded">
                Close
              </button>
            </div>

            <form onSubmit={addEvent} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Event name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded px-3 py-2 border border-emerald-600 bg-hc-900/40"
                  placeholder="e.g., Crypto Night CTF"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">Date</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                    type="date"
                    required
                    className="w-full rounded px-3 py-2 border border-emerald-600 bg-hc-900/40"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value as EventType }))}
                    className="w-full rounded px-3 py-2 border border-emerald-600 bg-hc-900/40"
                  >
                    <option>CTF</option>
                    <option>Meetup</option>
                    <option>Workshop</option>
                    <option>Conference</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm block mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                  placeholder="Venue or city (ignored if Online checked)"
                  className="w-full rounded px-3 py-2 border border-emerald-600 bg-hc-900/40"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.online}
                    onChange={(e) => setForm((s) => ({ ...s, online: e.target.checked }))}
                    className="rounded"
                  />
                  Online event
                </label>
              </div>

              <div>
                <label className="text-sm block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                  className="w-full rounded px-3 py-2 border border-emerald-600 bg-hc-900/40"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenCreate(false)}
                  className="px-4 py-2 rounded border border-emerald-600"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded border bg-emerald-600/10 border-emerald-400">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
