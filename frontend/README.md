
# ZeroDay — Hacker Social (CTF‑Gated)

A cyberpunk, hacker‑themed social platform built with **React + Vite + TypeScript**, **TailwindCSS**, **Zustand**, and **Supabase** (optional). Users must solve CTF challenges to unlock registration and gain access to the platform.

## Quick Start

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev / yarn dev
```

> The project ships with a **client‑side CTF gate** for demo. For production, use the Supabase backend below to verify challenges server‑side and issue badges securely.

## Scripts
- `dev` — run Vite dev server
- `build` — typecheck + production build
- `preview` — preview build

## Environment (optional Supabase integration)
Create `.env` at project root:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON=your_anon_key
```

## Supabase Schema (optional)

```sql
-- users
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  reputation int default 0,
  badges text[] default '{}',
  created_at timestamp with time zone default now()
);

-- posts
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  author uuid references profiles(id) on delete cascade,
  content text not null,
  code text,
  created_at timestamp with time zone default now()
);

-- messages (encrypted payload bytes, you decrypt client-side)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  sender uuid references profiles(id) on delete cascade,
  recipient uuid references profiles(id) on delete cascade,
  payload bytea not null,
  created_at timestamp with time zone default now()
);

-- ctf submissions (server-verified)
create table if not exists ctf_submissions (
  id uuid primary key default uuid_generate_v4(),
  profile uuid references profiles(id) on delete cascade,
  challenge text not null,
  answer text not null,
  correct boolean default false,
  created_at timestamp with time zone default now()
);
```

### Edge Function (pseudo)

Use a Supabase Edge Function to validate answers and mint a badge:

```ts
// supabase/functions/ctf-verify/index.ts (pseudo)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { userId, challenge, answer } = await req.json()
  const ok = validate(challenge, answer) // implement safely
  await supabase.from('ctf_submissions').insert({ profile: userId, challenge, answer, correct: ok })
  if (ok) {
    // add badge if all done
    const { data: done } = await supabase
      .from('ctf_submissions')
      .select('challenge', { count: 'exact' })
      .eq('profile', userId).eq('correct', true)
    if ((done?.length ?? 0) >= 3) {
      await supabase.from('profiles').update({ badges: ['Hacker Badge'] }).eq('id', userId)
    }
  }
  return new Response(JSON.stringify({ ok }), { headers: { 'content-type': 'application/json' } })
})
```

## Features Included
- CTF‑gated access (demo validators + badge issuance)
- Feed, posts, stories, reactions (UI)
- Profiles, groups, events, marketplace (UI)
- Encrypted DMs (demo)
- Code editor for posts (Monaco)
- Cyberpunk dark theme with glitch/scanline effects
- Zustand state for auth
- Router‑based pages

## Roadmap Hooks
- Replace demo validators with server‑side verification (Edge Function)
- Implement real E2E for DMs (WebCrypto + Diffie‑Hellman)
- Add notifications, mentions, follows, leaderboards (tables + queries)
- Add AI recommendations service (server route + embeddings)
