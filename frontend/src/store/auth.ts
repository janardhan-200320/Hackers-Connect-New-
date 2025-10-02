
import { create } from 'zustand'

type User = {
  id: string
  username: string
  reputation: number
  badges: string[]
}

type State = {
  user: User | null
  badge: string | null
  setBadge: (b:string|null)=>void
  login: (username:string, badge:string)=>void
  logout: ()=>void
}

const useAuth = create<State>((set)=>({
  user: null,
  badge: null,
  setBadge: (b)=>set({badge: b}),
  login: (username, badge)=>set({ user: { id: crypto.randomUUID(), username, reputation: 100, badges: [badge] }, badge }),
  logout: ()=>set({user:null, badge:null})
}))

export default useAuth
