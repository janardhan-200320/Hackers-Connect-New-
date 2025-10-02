
import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'

export default function LoginGate(){
  const { user, badge, login } = useAuth()
  const [username,setUsername] = useState('')

  useEffect(()=>{
    // Redirects would go here in a real app
  }, [user])

  const canRegister = badge === 'Hacker Badge'

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-emerald-400/30 bg-cyber-panel p-4">
        <div className="text-lg glitch-text">Access Control</div>
        <div className="text-sm">Solve CTF → Earn <span className="text-emerald-300">Hacker Badge</span> → Register/Login</div>
      </div>
      <div className="rounded-2xl border border-emerald-400/30 bg-cyber-panel p-4 space-y-2">
        <div className="text-sm">Status: {badge ? `Badge acquired: ${badge}` : 'No badge yet.'}</div>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Choose a handle (e.g., 0xRaven)" className="w-full bg-transparent border border-emerald-400/30 rounded-lg px-3 py-2 outline-none"/>
        <button disabled={!canRegister || !username.trim()} onClick={()=>login(username.trim(), badge!)} className="px-3 py-2 rounded-lg border border-emerald-400/40 hover:shadow-glow disabled:opacity-40">Register</button>
        {!canRegister && <div className="text-xs text-amber-400">You must complete challenges on the CTF page.</div>}
      </div>
    </div>
  )
}
